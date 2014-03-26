bootstrap-gallery
=================

A small, light, responsive Bootstrap Gallery

## Demo
* A clean demo can be found at: http://www.iekadou.com/programming/bootstrap-gallery/
* A demo working together with jquery-justifyGallery can be found at: http://www.iekadou.com/photography/


## Installation

* Download the latest release: [v0.0.5](https://github.com/iekadou/bootstrap-gallery/archive/0.0.5.zip)

## Usage

1. include `bootstrap-gallery.js` and `bootstrap-gallery.css`
  
  js:
  ```html
<script type="text/javascript" src="js/bootstrap-gallery.js"></script>
  ```
  css:
  ```html
<link rel="stylesheet" type="text/css" href="css/bootstrap-gallery.min.css">
  ```
  or less:
  ```html
<link rel="stylesheet/less" type="text/css" href="less/bootstrap-gallery.less">
  ```

2. code your gallery with markup like this

  ```html
  <div class="gallery row">
    <a class="col-xs-6 col-sm-4" href="/path/to/img1.jpg">
      <img src="/path/to/thumb1.jpg" alt="thumb1">
    </a>
    <a class="col-xs-6 col-sm-4" href="/path/to/img2.jpg">
      <img src="/path/to/thumb2.jpg" alt="thumb1">
    </a>
  </div>
  ```

3. activate the plugin on the gallery container
  
  ```javascript
$('.gallery').bootstrapGallery();
  ```

## Settings

### default values

the default values represent the setup for Bootstrap 3 with Glyphicons

  ```javascript
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
  ```
  
### FontAwesome

  to use the FontAwesome Icons just activate your gallery as below:

  ```javascript
$('.gallery-overview').bootstrapGallery({
  iconset: "fontawesome"
});
  ```

## Copyright and license

Copyright 2014 Jonas Braun under [MIT license](https://github.com/iekadou/bootstrap-gallery/blob/master/LICENSE).
