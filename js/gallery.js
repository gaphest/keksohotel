/* global HotelBase: true */

'use strict';

(function() {
  /**
   * @constructor
   * @extends {HotelBase}
   */
  var Gallery = function() {
    this.element = document.querySelector('.gallery');
    this._closeButton = this.element.querySelector('.gallery-close');

    this._onCloseClick = this._onCloseClick.bind(this);
  };

  Gallery.prototype = new HotelBase();

  /**
   * Показ галереи
   * @override
   */
  Gallery.prototype.render = function() {
    this.element.classList.remove('hidden');

    var thumbnailsContainer = this.element.querySelector('.gallery-thumbnails');

    this.getData().pictures.forEach(function(pic) {
      var picture = new Image();
      picture.height = 40;
      picture.src = pic;
      thumbnailsContainer.appendChild(picture);
    }, this);

    this.setCurrentImage(0);

    this._closeButton.addEventListener('click', this._onCloseClick);
  };

  /**
   * Убирание галереи
   */
  Gallery.prototype.remove = function() {
    this.element.classList.add('hidden');
    this._closeButton.removeEventListener('click', this._onCloseClick);
  };

  /**
   * Обработчик клика по крестику
   * @private
   */
  Gallery.prototype._onCloseClick = function() {
    this.remove();
  };

  /**
   * @param {number} i
   */
  Gallery.prototype.setCurrentImage = function(i) {
    if (this._currentImage === i) {
      return;
    }

    this._currentImage = i;
    if (this.element.querySelector('img.selected')) {
      this.element.querySelector('img.selected').classList.remove('selected');
    }
    this.element.querySelectorAll('.gallery-thumbnails img')[i].classList.add('selected');

    var image = new Image();
    image.src = this.getData().pictures[i];

    var previewContainer = this.element.querySelector('.gallery-preview');
    while (previewContainer.firstChild) {
      previewContainer.removeChild(previewContainer.firstChild);
    }

    previewContainer.appendChild(image);
  };

  window.Gallery = Gallery;
})();
