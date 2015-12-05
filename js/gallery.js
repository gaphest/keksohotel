'use strict';

(function() {
  /**
   * @constructor
   */
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');

    // Выходит, что совершенной приватности добиться невозможно.
    // Поэтому существует соглашение, гласящее, что если метод
    // или свойство начинается или заканчивается подчеркиванием,
    // он не предназначен для внешнего использования.
    this._onCloseClick = this._onCloseClick.bind(this);
  };

  /**
   * Показ галереи
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('hidden');

    // Добавим обработчик клика по крестику для закрытия галереи
    // Но теперь обработчик висит в памяти даже когда галерея
    // закрыта. При закрытии его надо убирать.
    this._closeButton.addEventListener('click', this._onCloseClick);
  };

  /**
   * Убирание галереи
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('hidden');
    // Но теперь опять потерялся контекст обработчика.
    // Функция bind возвращает новую функцию. Воспользуемся
    // этим, чтобы сохранить контекст для обработчика.
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
