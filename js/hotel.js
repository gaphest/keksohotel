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
   * @param {Object} data
   * @constructor
   */
  function Hotel(data) {
    this._data = data;
  }

  /**
   * Создание элемента отеля из шаблона
   */
  Hotel.prototype.render = function() {
    var template = document.querySelector('#hotel-template');
    var hotelRating = this._data.rating || 6.0;

    if ('content' in template) {
      this.element = template.content.children[0].cloneNode(true);
    } else {
      this.element = template.children[0].cloneNode(true);
    }

    this.element.querySelector('.hotel-stars').classList.add(starsClassName[this._data.stars]);
    this.element.querySelector('.hotel-rating').classList.add(ratingClassName[Math.floor(hotelRating)]);

    this.element.querySelector('.hotel-name').textContent = this._data.name;
    this.element.querySelector('.hotel-rating').textContent = hotelRating.toFixed(1);
    this.element.querySelector('.hotel-price-value').textContent = this._data.price;

    var amenitiesContainer = this.element.querySelector('.hotel-amenities');

    this._data.amenities.forEach(function(amenity) {
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
      backgroundImage.src = ''; // Прекращаем загрузку
      this.element.classList.add('hotel-nophoto'); // Показываем ошибку
    }.bind(this), IMAGE_TIMEOUT);

    // Изменение src у изображения начинает загрузку.
    backgroundImage.src = this._data.preview;
  };

  window.Hotel = Hotel;
})();
