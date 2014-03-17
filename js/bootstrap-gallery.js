/*!
 * bootstrap-gallery v0.0.5 by @iekadou
 * Copyright (c) 2014 Jonas Braun
 *
 * http://www.noxic-action.de/page/programming/bootstrap-gallery
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
(function ($) {

    'use strict';

    // BOOTSTRAPGALLERY CLASS DEFINITION
    // =================================

    var BootstrapGallery = function (element, options) {
        this.$gallery = $(element);
        this.options = $.extend({}, BootstrapGallery.defaults);
        if (options.hasOwnProperty('iconset') && options.iconset == 'fontawesome') {
            $.extend(this.options, BootstrapGallery.fontawesomeOptions);
        }
        $.extend(this.options, options);
        this.count = this.$gallery.children().length;
        this.index = 0;
        if (BootstrapGallery.elements === undefined) {
            var elements = {
                "$modal": $("<div/>").attr(this.options.modalAttrs),
                "$container": $("<div/>").attr(this.options.containerAttrs),
                "$closeBtn": $("<button/>").attr(this.options.closeBtnAttrs),
                "$btnPrev": $("<button/>").attr(this.options.btnPrevAttrs),
                "$btnNext": $("<button/>").attr(this.options.btnNextAttrs),
                "$img": $("<img/>").attr(this.options.imgAttrs),
                "$indicator": $("<span/>").attr(this.options.indicatorAttrs)
            };
            // if you want controls to be outside to be on the same position for every image you dont need a imgwrapper
            if (! (this.options.hasOwnProperty('controlsOutside') && this.options.controlsOutside == true)) {
                elements["$wrapper"] = $("<div/>").attr(this.options.wrapperAttrs);
                elements["wrapper"] = elements["$wrapper"][0];
                elements.$wrapper.append(elements.$closeBtn, elements.$btnPrev, elements.$btnNext, elements.$img, elements.$indicator);
                elements.$container.append(elements.$wrapper);
                elements.$modal.append(elements.$container);
            } else {
                elements.$container.append(elements.$btnPrev, elements.$btnNext, elements.$img, elements.$indicator);
                elements.$modal.append(elements.$closeBtn, elements.$container);
            }
            $('body').append(elements.$modal);
            this.elements = elements;
            BootstrapGallery.elements = elements;

            this.registerKeys();
            this.registerWindowResize();
            this.registerTouches();
        } else {
            this.elements = BootstrapGallery.elements;
        }
        this.registerThumbs();
    };

    // BOOTSTRAPGALLERY DEFAULT OPTIONS
    // ================================

    BootstrapGallery.defaults = {
        modalAttrs: {
            "id": "gallery-modal",
            "class": "modal fade",
            "tabindex": "-1",
            "role": "dialog",
            "aria-hidden": "true"
        },
        containerAttrs: {
            "class": "img-container"
        },
        wrapperAttrs: {
            "class": "img-wrapper"
        },
        imgAttrs: {
            "class": "img-responsive",
            "src": "#"
        },
        closeBtnAttrs: {
            "class": "btn-close glyphicon glyphicon-remove",
            "aria-hidden": "true"
        },
        btnPrevAttrs: {
            "class": "btn-prev glyphicon glyphicon-chevron-left"
        },
        btnNextAttrs: {
            "class": "btn-next glyphicon glyphicon-chevron-right"
        },
        indicatorAttrs: {
            "class": "indicator glyphicon glyphicon-refresh"
        },
        indicatorThreshold: 100,
        swipeThreshold: 30
    };

    BootstrapGallery.fontawesomeOptions = {
        closeBtnAttrs: {
            "class": "btn-close fa fa-times",
            "aria-hidden": "true"
        },
        btnPrevAttrs: {
            "class": "btn-prev fa fa-angle-left"
        },
        btnNextAttrs: {
            "class": "btn-next fa fa-angle-right"
        },
        indicatorAttrs: {
            "class": "indicator fa fa-refresh fa-spin"
        }
    };

    // BOOTSTRAPGALLERY METHODS
    // ========================

    BootstrapGallery.prototype.registerBtns = function () {
        var elements = this.elements;
        var self = this;

        elements.$btnNext.off('click').on('click', function (e) {
            e.preventDefault();
            self.index++;
            if (self.index >= self.count) {
                self.index = 0;
            }
            self.updateImg(self.index);
            return false;
        });

        elements.$btnPrev.off('click').on('click', function (e) {
            e.preventDefault();
            self.index--;
            if (self.index < 0) {
                self.index = self.count - 1;
            }
            self.updateImg(self.index);
            return false;
        });

        elements.$container.off('click').on('click', function (e) {
            e.preventDefault();
            elements.$modal.modal('hide');
        });

        elements.$closeBtn.off('click').on('click', function (e) {
            e.preventDefault();
            elements.$modal.modal('hide');
        });
        if (elements.hasOwnProperty('$wrapper')) {
            elements.$container.off('click').on('click', function (e) {
                e.preventDefault();
                elements.$modal.modal('hide');
            });
            elements.$wrapper.off('click').on('click', function (e) {
                e.preventDefault();
                return false;
            });
        } else {
            elements.$img.off('click').on('click', function (e) {
                e.preventDefault();
                return false;
            });
        }
    };

    BootstrapGallery.prototype.registerKeys = function () {
        var elements = this.elements;
        elements.$modal.off('keydown').on('keydown', function (e) {
            // left arrow to go back
            if (e.keyCode == 37) {
                elements.$btnPrev.click();
            }
            // right arrow to go back
            if (e.keyCode == 39) {
                elements.$btnNext.click();
            }
            // esc to close modal
            if (e.keyCode == 27) {
                elements.$modal.modal('hide');
            }
        });
    };

    BootstrapGallery.prototype.registerThumbs = function () {
        var elements = this.elements;
        var self = this;
        this.$gallery.children().each(function () {
            $(this).off('click').on('click', function (e) {
                e.preventDefault();
                elements.$indicator.css('display', 'none');
                self.index = $(this).index();
                self.updateImg(self.index);
                elements.$modal.modal();
                self.registerBtns();

                setTimeout(function () {
                    elements.$modal.focus();
                }, 200);
            });
        });
    };

    BootstrapGallery.prototype.registerTouches = function () {
        var self = this;
        self.clientXStart = 0;
        self.clientXEnd = 0;
        self.elements.$modal.on('touchstart',function (e) {
            self.clientXStart = self.clientXEnd = e.originalEvent.touches[0].clientX;
        }).on('touchmove',function (e) {
            e.preventDefault();
            self.clientXEnd = e.originalEvent.touches[0].clientX;
        }).on('touchend', function (e) {
            if (self.clientXStart > self.clientXEnd + self.options.swipeThreshold) {
                self.elements.$btnNext.click();
            } else if (self.clientXStart < self.clientXEnd - self.options.swipeThreshold) {
                self.elements.$btnPrev.click();
            }
        });
    };

    BootstrapGallery.prototype.registerWindowResize = function () {
        var self = this;
        if (self.elements.hasOwnProperty('$wrapper')) {
            var wrapper = this.elements.wrapper;
            $(window).resize(function () {
                wrapper.style.display = "none";
                wrapper.offsetHeight; // force browser to rerender modal.
                wrapper.style.display = "inline-block";
                self.elements.$img.css('max-height', parseInt(parseInt($(window).height())*0.9));
            });
        } else {
            $(window).resize(function () {
                self.elements.$img.css('max-height', parseInt(parseInt($(window).height())*0.9));
            });
        }
    };

    BootstrapGallery.prototype.updateImg = function (index) {
        var self = this;
        var newSrc = self.$gallery.children().get(index).getAttribute('href');
        if (self.elements.$img.attr("src") != newSrc) {
            self.elements.$indicator.delay(self.options.indicatorThreshold).queue(function(next){
                $(this).css('display','inline-block');
                next();
            });
            self.elements.$img.attr("src", newSrc).load(function() {
                self.elements.$indicator.stop().css('display','none');
            }).css('max-height', parseInt(parseInt($(window).height())*0.9));
        }
    };

    // BOOTSTRAPGALLERY PLUGIN DEFINITION
    // ==================================

    var old = $.fn.bootstrapGallery;

    $.fn.bootstrapGallery = function (options) {
        return this.each(function () {
            var data = $(this).data('bs.Gallery');
            if (!data) {
                $(this).data('bs.Gallery', (data = new BootstrapGallery($(this), options)));
            }
        });
    };

    $.fn.bootstrapGallery.Constructor = BootstrapGallery;

    // BOOTSTRAPGALLERY NOCONFLICT
    // ===========================

    $.fn.bootstrapGallery.noConflict = function () {
        $.fn.bootstrapGallery = old;
        return this
    }

}(jQuery));
