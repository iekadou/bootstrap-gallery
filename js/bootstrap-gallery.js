/*!
 * bootstrap-gallery v0.0.1 by @iekadou
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

    var BootstrapGallery = function(element, options) {
        this.$gallery = $(element);
        this.options = $.extend({}, BootstrapGallery.defaults, options);
        this.count = this.$gallery.children().length;
        this.index = 0;
		if (BootstrapGallery.elements === undefined) {
            var elements = {
                "$modal": $("<div/>").attr(this.options.modalAttrs),
                "$container": $("<div/>").attr(this.options.containerAttrs),
                "$wrapper": $("<div/>").attr(this.options.wrapperAttrs),
                "$closeBtn": $("<button/>").attr(this.options.closeBtnAttrs),
                "$btnPrev": $("<button/>").attr(this.options.btnPrevAttrs),
                "$btnNext": $("<button/>").attr(this.options.btnNextAttrs),
                "$img": $("<img/>").attr(this.options.imgAttrs)
            };
            elements["wrapper"] = elements.$wrapper[0];

			elements.$wrapper.append(elements.$closeBtn, elements.$btnPrev, elements.$btnNext, elements.$img);
			elements.$container.append(elements.$wrapper);
			elements.$modal.append(elements.$container);
			$('body').append(elements.$modal);
            this.elements = elements;
            BootstrapGallery.elements = elements;
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
			"aria-hidden":"true"
	    },
		containerAttrs: {
			"class": "img-container"
		},
		wrapperAttrs: {
			"class": "img-wrapper"
		},
		closeBtnAttrs: {
			"class": "btn-close fa fa-times",
			"aria-hidden": "true"
		},
		imgAttrs: {
			"class": "img-responsive",
			"src": "#"
		},
		btnPrevAttrs: {
			"class": "btn-prev fa fa-angle-left"
		},
		btnNextAttrs: {
			"class": "btn-next fa fa-angle-right"
		}
	};

    // BOOTSTRAPGALLERY METHODS
    // ========================

    BootstrapGallery.prototype.registerThumbs = function() {
        var elements = this.elements;
        var self = this;
        this.$gallery.children().each(function() {
            $(this).off('click').on('click', function(e) {
                e.preventDefault();
                elements.$img.attr('src', $(this).attr("href"));
                self.index = $(this).index();
                elements.$modal.modal();

                self.registerBtns();
                self.registerKeys();
                self.registerWindowResize();
                setTimeout( function() { elements.$modal.focus(); }, 200 );
            });
        });
    };

    BootstrapGallery.prototype.registerBtns = function() {
        var elements = this.elements;
        var self = this;

        function updateImg(index) {
            elements.$img.attr("src", self.$gallery.children(":eq("+index+")").attr("href"));
        }

        elements.$btnNext.off('click').on('click', function(e) {
            e.preventDefault();
            self.index++;
            if (self.index >= self.count) {
                self.index = 0;
            }
            updateImg(self.index);
        });

        elements.$btnPrev.off('click').on('click', function(e) {
            e.preventDefault();
            self.index--;
            if (self.index < 0) {
                self.index = self.count-1;
            }
            updateImg(self.index);
        });

        elements.$container.off('click').on('click', function(e) {
            e.preventDefault();
            elements.$modal.modal('hide');
        });

        elements.$closeBtn.off('click').on('click', function(e) {
            e.preventDefault();
            elements.$modal.modal('hide');
        });

        elements.$wrapper.off('click').on('click', function(e) {
            e.preventDefault();
            return false;
        });
    };

    BootstrapGallery.prototype.registerKeys = function() {
        var elements = this.elements;
        elements.$modal.off('keydown').on('keydown', function(e){
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

    BootstrapGallery.prototype.registerWindowResize = function() {
        var wrapper = this.elements.wrapper;
        $(window).resize(function() {
            wrapper.style.display = "none";
            wrapper.offsetHeight; // force browser to rerender modal.
            wrapper.style.display = "inline-block";
        });
    };

    // BOOTSTRAPGALLERY PLUGIN DEFINITION
    // ==================================

    var old = $.fn.bootstrapGallery;

	$.fn.bootstrapGallery = function( options ) {
        return this.each(function() {
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