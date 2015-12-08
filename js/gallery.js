'use strict';

(function() {
  /**
   * @constructor
   */
  var Gallery = function() {
    this.element = document.querySelector('.gallery');
    this._closeButton = this.element.querySelector('.gallery-close');
    this._data = null;

    this._onCloseClick = this._onCloseClick.bind(this);
  };

  /**
   * Показ галереи
   */
  Gallery.prototype.render = function() {
    this.element.classList.remove('hidden');
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
    this.hide();
  };

  window.Gallery = Gallery;
})();
