var $headerHeight, $logoHeight = 0;

/* Business logic to handle hover behaviour on one product element */
function altPicHover() {
    let item = $(this);

    /* Get the alt image wrappers */
    let altPics = item.find(".js-alt-img-wrap");

    /* Get the main image */
    let mainPic = item.find(".js-main-img");
    let mainPicSrc = mainPic.attr("data-src-orig");
    let mainPicSrcSet = mainPic.attr("data-srcset-orig");
    if (mainPicSrcSet === undefined) mainPicSrcSet="";

    /* Get the main image source tag */
    let mainPicSource = mainPic.prev("source");
    let mainPicSourceSrcSet = mainPicSource.attr("data-srcset-orig");
    let mainPicSourceMedia = mainPicSource.attr("media");
    let origEl = mainPic;
    let origSrc = mainPicSrc;
    let origSrcSet = mainPicSrcSet;

    if ( typeof mainPicSource !== 'undefined' && matchMedia('screen and '+ mainPicSourceMedia).matches ) {
        origEl = mainPicSource;
        origSrcSet = mainPicSourceSrcSet;
    }

    /* Business logic to handle swapping of the main img and one alt img */
    function handleSwap() {
        let $this = $(this);

        /* When hovering over the alt img swap it with the main img */
        $this.mouseover(function() {
            var currentAltPicSrc = $(this)
                .find("img")
                .attr("data-src-orig");
            origEl.attr("src", currentAltPicSrc);

            let currentAltPicSrcSet = $(this)
                .find("img")
                .attr("data-srcset-orig");
            if (currentAltPicSrcSet === undefined) currentAltPicSrcSet="";
            origEl.attr("srcset", currentAltPicSrcSet);
        });
    }

    item.find('.js-alt-images').mouseleave(function() {
        origEl.attr("src", origSrc);
        origEl.attr("srcset", origSrcSet);
    });

    /* Call the handleSwap fn on all alt imgs */
    altPics.each(handleSwap);
}

/* CHECK SEARCH INPUT CONTENT  */
function checkForInput(element) {
    let thisEl = $(element);
    let tmpval = thisEl.val();
    thisEl.toggleClass('not-empty', tmpval.length >= 1);
    thisEl.toggleClass('search-enable', tmpval.length >= 3);
}

function getScrollTop() {
    return $(window).scrollTop();
}

function headerToFixed() {
    if ( !$('.js-header').hasClass("js-header--fixed")) {
        $('.js-header').addClass("js-header--fixed");
        $('.js-content').addClass("js-content--margin-top");
        setContentMarginTop();
    }
}

function setContentMarginTop() {
    $('.js-content').css('margin-top', $headerHeight);
}

/*header resizer*/
function logoResizer(page_type,logo_resizer_v,$logoHeight,$header,$logoElement,$origLogoHeight,$mobileLogoHeight) {
    if (logo_resizer_v == 'v1') {
        if (page_type == 'full') {
            /* from tablet: breakpoint: -md- */
            if (getWindowWidth() >= 576) {
                $logoHeight = $logoHeight / 2;
                $header.css('top', '');

                if (getScrollTop() >= $logoHeight) {
                    if (!$logoElement.hasClass('is-animating')) {
                        $logoElement.stop().animate({maxHeight: $mobileLogoHeight + 'px'}, 200, function () { /*setContentMarginTop();*/
                        });
                        $logoElement.addClass('is-animating');
                        $header.addClass('is-resized');
                    }
                } else {
                    if ($logoElement.hasClass('is-animating')) {
                        $logoElement.removeClass('is-animating');
                        $logoElement.stop().animate({maxHeight: $origLogoHeight + 'px'}, 200, function () { /*setContentMarginTop();*/
                        });
                        $header.removeClass('is-resized');
                    }
                }
            } else { /* till mobile, tablet: breakpoint: -sm- */

                if (getScrollTop() >= $logoHeight) {
                    if (!$header.hasClass('is-hidden')) {
                        $('.js-header').css('top', '-' + $logoHeight + 'px').addClass('is-hidden');
                    }
                } else {
                    if ($header.hasClass('is-hidden')) {
                        if (!$('html').hasClass('scroll-hidden')) {
                            $header.css('top', '0').removeClass('is-hidden');
                        }
                    }
                }

            }
        }
    } else {
        if (page_type == 'full') {
            /* from tablet: breakpoint: -md- */
            if (getWindowWidth() >= 576) {
                $logoHeight = $logoHeight / 2;
                $header.css('top', '');

                if (getScrollTop() >= $logoHeight) {
                    $header.addClass('is-resized');
                } else {
                    $header.removeClass('is-resized');
                }
            } else { /* till mobile, tablet: breakpoint: -sm- */
                if (getScrollTop() >= $logoHeight) {
                    if (!$header.hasClass('is-hidden')) {
                        $header.css('top', '-' + $logoHeight + 'px').addClass('is-hidden');
                    }
                } else {
                    if ($header.hasClass('is-hidden')) {
                        if (!$('html').hasClass('scroll-hidden')) {
                            $header.css('top', '0').removeClass('is-hidden');
                        }
                    }
                }

            }
        }
    }
}

function checkLogged(profile_btn_id) {
    if ($('#container').hasClass('logged-in')) {
        location.href = $('#' + profile_btn_id).data('orders');
    } else {
        location.href = $('#' + profile_btn_id).data('login');
    }
}

function getHeaderHeight() {
    return $('.js-header').height();
}

function getLogoHeight(el) {
    return $(el).outerHeight(true); /*with margin*/
}

function getWindowWidth() {
    return $(window).width();
}

function responsive_cat_menu() {
    /*console.log('mobile_cat_closed');*/
}

function orderModsChangeShipping(money_type){
    if ($('#page_order_mods_shipping .order-mods__item input[type=radio]:checked').length>0) {
        var $this = $('#page_order_mods_shipping .order-mods__item input[type=radio]:checked');
        var $shipping_mod_id = $this.prop('id').substr(9,$this.prop('id').length-6);
        var $selector = '#page_order_mods_shipping #szall_mod_'+$shipping_mod_id+'.order-mods__item .order-mods__shipping-cost';
        var $selector2 = '#page_order_mods_shipping #szall_mod_'+$shipping_mod_id+'.order-mods__item .order-mods__shipping-cost-hidden';

        var $total = parseFloat($('.order-mods__total_price_hidden').text());
        var $shipping_cost = parseFloat($($selector2).text());
        $('.order-mods-total-amount').text(number_format(($total+$shipping_cost),money_len,money_dec,money_thousend)+" "+money_type);
        $('.order-mods-summary-post .order-mods-summary-value').text($($selector).text());
    } else {
        $('.order-mods-total-amount').text(number_format(parseFloat($('.order-mods__total_price_hidden').text()),money_len,money_dec,money_thousend)+" "+money_type);
        $('.order-mods-summary-post .order-mods-summary-value').text("-");
    }
}

function check_filter_box_content () {
    if($(".product-filter__content").html()!=="") {
        $(".product-filter").css('display','flex');
    }
}

$(document).on("filterBoxLoaded",function () {
    check_filter_box_content();
});

$(document).ready(function() {
    const logoElement = $('#container').hasClass('logo-resizer-v2') ? '.header_logo-img' : '.header_logo';
    const logo_resizer_v = $('#container').hasClass('logo-resizer-v2') ? 'v2' : 'v1';
    const page_type = $('#container').hasClass('page-simplified') ? 'simplified' : 'full';
    const $logoElement = $(logoElement);
    const $header = $('.js-header');
    const origLogoHeight = $logoElement.data('height');
    const mobileLogoHeight = $logoElement.data('height') / 2;

    $logoHeight =  getLogoHeight($logoElement);
    $headerHeight = getHeaderHeight();

    /* HEADER RESIZER */
    headerToFixed();
    logoResizer(page_type,logo_resizer_v,$logoHeight,$header,$logoElement,origLogoHeight,mobileLogoHeight);

    /* WINDOW RESIZE */
    $(window).on("resize",function(){
        $logoHeight =  getLogoHeight($logoElement);
        $headerHeight = getHeaderHeight();
        setContentMarginTop();
    });

    $(window).on("scroll",function(){
        headerToFixed();
        logoResizer(page_type,logo_resizer_v,$logoHeight,$header,$logoElement,origLogoHeight,mobileLogoHeight);
    });

    if ($('.js-side-box').children().length == 0 ) {
        $('.js-content').addClass('no-aside');
    }

    /* MONEY AND LANG */
    if($(".currency__content").html()!="") {
        $('.js-lang-and-cur').addClass('has-currency');
    }

    if($(".lang__content").html()!="") {
        $('.js-lang-and-cur').addClass('has-lang');
    }

    /* HEADER HAS PLUS MENU*/
    if($(".js-header_menu--m").children().length > 0) {
        $('.js-header-plus-menu').addClass('has-plus-menu');
    }

    check_filter_box_content();

    /* COMPARE POPUP OPENED */
    $(document).on("popupOpen", function(event, array){
        if (array["popupId"] === "compare") {
            setTimeout(
                function() {
                    $('table.compare_list_table tbody').width($('.shop_popup_compare').width());
                }, 400
            );
        }
    });

    /* BACk TO TOP */

    var offset = 220;
    var duration = 500;
    $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
            $(".back_to_top").fadeIn(duration);
        } else {
            $(".back_to_top").fadeOut(duration);
        }
    });
    $(".back_to_top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({scrollTop: 0}, duration);
        return false;
    });

    /*filter_title close*/
    $("#reload1_box_filter_content .product_filter_title").addClass("filter_opened");
    $("#box_filter_content .product_filter_title:first-child").addClass("filter_opened");
    $(document).on( 'click', '.product_filter_title', function() {
            $(this).toggleClass("filter_opened");
            $(this).next(".product_filter_content").stop().slideToggle(400);
        }
    );

    $('.js-dropdown-container').hoverIntent({
        over: function () {
            $('.js-dropdown--btn, .hm--d > .menu_item_haschild').removeClass('is-active');
            var $this_dropdown=$(this);
            if ($this_dropdown.find('.js-dropdown--content').length > 0) {
                $this_dropdown.find('.js-dropdown--btn').addClass('is-active').addClass('click-close-forbidden');
                setTimeout(
                    function() {
                        $this_dropdown.find('.js-dropdown--btn').removeClass('click-close-forbidden');
                    }, 500
                );
            }
        },
        out: function () {
            var $this_dropdown=$(this);
            if ($this_dropdown.find('.js-dropdown--content').length > 0) {
                $this_dropdown.find('.js-dropdown--btn').removeClass('is-active').removeClass('click-close-forbidden');
            }
        },
        selector: '.js-dropdown--btn',
        interval:100,
        sensitivity:6,
        timeout: 500
    });


    /* HOVER INTENT PLUS MENU DESKTOP */
    $('.hm--d .menu_item_haschild').hoverIntent({
        over: function () {
            var $thisMenuItem = $(this);
            $('.js-dropdown--btn').removeClass('is-active');

            /* remove is-active class only from main menu items */
            if ($thisMenuItem.parents('.menu_item_haschild').length < 1) {
                $('.hm--d > .menu_item_haschild').removeClass('is-active');
            }
            $thisMenuItem.addClass('is-active');
        },
        out: function () {
            $(this).removeClass('is-active');
        },
        interval:100,
        sensitivity:6,
        timeout: 500
    });

    /* add class to .js-content element, if it has not any children */
    /* when .js-content class added: */
    /* - make main element to full width */
    /* - make product elements wider */

    /*Check the user agent string*/
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $('html').addClass('prel-touch-device');
    }
    /* IS TOUCH DEVICE */
    $(document).on('touchstart', function() {
        $('html').removeClass('prel-touch-device').addClass('touch-device');
    });
    /* DROPDOWN BUTTONS */


    $(".header").on("click",".js-dropdown--btn", function(e){
        var $thisBtn = $(this);

        if ($thisBtn.next('.js-dropdown--content').length > 0 ) {
            if ($thisBtn.hasClass('is-active')) {
                if (!$thisBtn.hasClass('click-close-forbidden')) {
                    $thisBtn.removeClass('is-active');
                }
            } else {
                $('.js-dropdown--btn').removeClass('is-active');
                $thisBtn.addClass('is-active');
                if ($thisBtn.hasClass('search-box__btn')) {
                    let $searchInput = $('#box_search_input');
                    if ($searchInput.prop('readonly')==true) {
                        $searchInput.blur();
                        $searchInput.prop('readonly', false);
                    }
                    $searchInput.focus();
                }
            }
        }
        e.stopPropagation();
    });


    $(".header").on("click",".js-dropdown--btn-close, .responsive_menu_close", function(e){
        var $this = $(this);
        var $closestBtn = $this.closest('.js-dropdown-container').find('.js-dropdown--btn');

        if ($closestBtn.hasClass('is-active')) {
            $closestBtn.removeClass('is-active');
        }
        e.stopPropagation();

    });

    /* CHECK SEARCH INPUT CONTENT  */
    $('#box_search_input').on('blur change keyup', function() {
        checkForInput(this);
    });

    /* REMOVE is-active CLASS FROM DROPDOWN WHEN CLICKED OUTSIE */
    $(document).click(function(e) {
        if ($('.js-dropdown--btn').hasClass("is-active") && !$('.js-dropdown--btn').hasClass("click-close-forbidden")) {
            if (!$(e.target).closest('.js-dropdown--btn').length && !$(e.target).closest('.js-dropdown--content').length) {
                $('.js-dropdown--btn, .js-dropdown--content').removeClass('is-active');
            }
        }
    });

    /* DATA SCROLL DOWN */
    $(".js-scroll-down").click(function() {
        var $this = $(this);
        var $offset = 10;
        var $resizedHeaderHeight = getWindowWidth() >= 767 ? 70 : 50;

        $('html,body').animate({
            scrollTop: $('.' + $this.attr('data-scroll')).offset().top - $offset - $resizedHeaderHeight},
        'slow');
    });

    /* CAT BOX */
    $(".cat-box__item-level-0.has-item").hoverIntent({
        over: function () {
            $(this).addClass('open');
        },
        out: function () {
            $( this ).removeClass('open');
        },
        interval:100,
        sensitivity:6,
        timeout: 300
    });

    $('.product-filter .param_desc_popup.param_desc_popup_ver4').click(function(e){
        var tooltipIcon = $(this);
        var tooltipText = $('> span', tooltipIcon);
        var tooltipHeight = tooltipText.outerHeight();
        var parentBox = $(".product-filter__content");

        if(e.target.tagName.toLowerCase() != 'a') {
            if (tooltipIcon.hasClass('tooltip-is-visible')) {
                tooltipIcon.removeClass('tooltip-is-visible');
            } else {
                if (tooltipHeight + 20 > (tooltipIcon.offset().top - parentBox.offset().top)) {
                    tooltipIcon.removeClass('desc-to-top').addClass('desc-to-bottom');
                } else {
                    tooltipIcon.removeClass('desc-to-bottom').addClass('desc-to-top');
                }
                tooltipIcon.addClass('tooltip-is-visible');
            }
            e.preventDefault();
            e.stopPropagation();
        }
    });
    $('.product-filter .param_desc_popup.param_desc_popup_ver4 > span').click(function(e){
        if(e.target.tagName.toLowerCase() != 'a') {
            e.preventDefault();
            e.stopPropagation();
        }
    });
})

/*** TIPPY ***/
function initTippy() {
    if (typeof tippy == 'function') {
        tippy('[data-tippy]:not(.tippy-inited)', {
            allowHTML: true,
            /*interactive: true,*/
            hideOnClick: false,
            zIndex: 10000,
            maxWidth: "300px",
            onShow: function onShow(instance) {
                instance.popper.hidden = instance.reference.dataset.tippy ? false : true;
                instance.setContent(instance.reference.dataset.tippy);

                function changeTippyText(text, el) {
                    instance.setContent(text);
                    el.attr("data-tippy", text);
                }
            },
            onCreate: function onCreate(instance) {
                instance.reference.classList.add('tippy-inited');
            }
        });
    }
}