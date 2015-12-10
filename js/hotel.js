/* global HotelBase: true */

'use strict';

(function() {
  /**
   * Массив соотсветствий рейтинга отеля DOM-классу элементам
   * со звездами.
   * @type {Array.<string>}
   */
  var starsClassName = [
    'hotel-stars',
    'hotel-stars',
    'hotel-stars-two',
    'hotel-stars-three',
    'hotel-stars-four',
    'hotel-stars-five'
  ];

  /**
   * Соответствие округленного вниз рейтинга классу
   * для блока с рейтингом.
   * @type {Object.<string, string>}
   */
  var ratingClassName = {
    'undefined': 'hotel-rating-none',
    '4': 'hotel-rating-four',
    '5': 'hotel-rating-five',
    '6': 'hotel-rating-six',
    '7': 'hotel-rating-seven',
    '8': 'hotel-rating-eight',
    '9': 'hotel-rating-none'
  };

  /**
   * Соответствие id дополнительных удобств
   * классам блоков с удобствами.
   * @type {Object.<string, string>}
   */
  var amenityClassName = {
    'breakfast': 'hotel-amenity-breakfast',
    'parking': 'hotel-amenity-parking',
    'wifi': 'hotel-amenity-wifi'
  };

  /**
   * Соответствие id дополнительных удобств
   * названиям удобств в разметке.
   * @type {Object.<string, string>}
   */
  var amenityName = {
    'breakfast': 'Завтрак',
    'parking': 'Парковка',
    'wifi': 'WiFi'
  };

  /**
   * @constructor
   * @extends {HotelBase}
   */
  function Hotel() {
    this._onClick = this._onClick.bind(this);
  }

  Hotel.prototype = new HotelBase();

  /**
   * Создание элемента отеля из шаблона
   * @override
   */
  Hotel.prototype.render = function() {
    var template = document.querySelector('#hotel-template');
    var hotelRating = this.getData().getProperty('rating') || 6.0;

    this.element = 'content' in template ?
        template.content.children[0].cloneNode(true) :
        template.children[0].cloneNode(true);

    this.element.querySelector('.hotel-stars').classList.add(starsClassName[this.getData().getProperty('stars')]);
    this.element.querySelector('.hotel-rating').classList.add(ratingClassName[Math.floor(hotelRating)]);

    this.element.querySelector('.hotel-name').textContent = this.getData().getProperty('name');
    this.element.querySelector('.hotel-rating').textContent = hotelRating.toFixed(1);
    this.element.querySelector('.hotel-price-value').textContent = this.getData().getProperty('price');

    var amenitiesContainer = this.element.querySelector('.hotel-amenities');

    this.getData().getProperty('amenities').forEach(function(amenity) {
      var amenityElement = document.createElement('li');
      amenityElement.classList.add('hotel-amenity', amenityClassName[amenity]);
      amenityElement.innerHTML = amenityName[amenity];
      amenitiesContainer.appendChild(amenityElement);
    });

    /**
     * @type {Image}
     */
    var backgroundImage = new Image();

    backgroundImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      this.element.style.backgroundImage = 'url(\'' + backgroundImage.src + '\')';
    }.bind(this);

    backgroundImage.onerror = function() {
      this.element.classList.add('hotel-nophoto');
    }.bind(this);

    /**
     * @const
     * @type {number}
     */
    var IMAGE_TIMEOUT = 10000;

    var imageLoadTimeout = setTimeout(function() {
      backgroundImage.src = '';
      this.element.classList.add('hotel-nophoto');
    }.bind(this), IMAGE_TIMEOUT);

    backgroundImage.src = this.getData().getProperty('preview');

    this.element.addEventListener('click', this._onClick);
  };

  /** @override */
  Hotel.prototype.remove = function() {
    this.element.removeEventListener('click', this._onClick);
  };

  /**
   * @param {Event} evt
   * @private
   */
  Hotel.prototype._onClick = function(evt) {
    // Клик, который транслируется наружу должен происходить
    // по фону элемента, если у него есть фотография на фоне.
    if (evt.target.classList.contains('hotel') &&
      !this.element.classList.contains('hotel-nophoto')) {
      // Нужно вызвать коллбэк, который будет переопределен снаружи
      if (typeof this.onClick === 'function') {
        this.onClick();
      }
    }
  };

  /** @type {?Function} */
  Hotel.prototype.onClick = null;

  window.Hotel = Hotel;
})();
