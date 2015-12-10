/* global google: true */
/**
 * @fileoverview Модуль для работы с картой Google.
 * @author Igor Alexeenko (igor.alexeenko@htmlacademy.ru)
 */

'use strict';

(function() {
  /** @constant {number} */
  var ANIMATION_DURATION = 250;

  /** @constant {string} */
  var API_KEY = 'AIzaSyD4O4PUGzJW-L6cz6_gGZpWwShDliv8QhI';

  /** @constant {string} */
  var JSONP_CALLBACK = '__gmapscallback';

  /**
   * Центр Токио для инициализации карты с правильными координатами.
   * @constant
   * @type {{ lat: number, lng: number }}
   */
  var TOKIO_CENTER = {
    lat: 35.6833,
    lng: 139.6833
  };

  /**
   * @param {Element} container
   * @constructor
   */
  var MapElement = function(container) {
    this.map = null;
    this.container = container;
    this.isLoaded = false;
    this.isCollapsed = true;

    this._toggle = this.container.querySelector('.map-switch');
  };

  /**
   * Инициализация API Google карт.
   */
  MapElement.prototype.initializeAPI = function() {
    window['__gmapscallback'] = function() {
      this.isLoaded = true;
      this.onload();

      // В этом случае необязательна именованная функция, потому что
      // карта работает на странице все время.
      this._toggle.addEventListener('click', function() {
        // Переключатель как сворачивает, так и разворачивает карту.
        this.setCollapsed(!this.isCollapsed);
      }.bind(this));
    }.bind(this);

    // JSONP загрузка API карт Google.
    var scriptElement = document.createElement('script');
    scriptElement.async = true;
    scriptElement.deferred = true;
    scriptElement.src = [
      'https://maps.googleapis.com/maps/api/js?key=' +
      API_KEY +
      '&callback=',
      JSONP_CALLBACK
    ].join('');

    document.body.appendChild(scriptElement);
  };

  /**
   * Отрисовка карты.
   */
  MapElement.prototype.render = function() {
    this.map = new google.maps.Map(this.container.querySelector('.map-container'), {
      center: new google.maps.LatLng(TOKIO_CENTER.lat, TOKIO_CENTER.lng),
      scrollWheel: false,
      zoom: 12
    });
  };

  /**
   * Коллбэк загрузки API карт Google.
   * @type {Function}
   */
  MapElement.prototype.onload = null;

  /**
   * Разворачивание и сворачивание карты.
   * @param {boolean} collapsed
   */
  MapElement.prototype.setCollapsed = function(collapsed) {
    if (collapsed === this.isCollapsed) {
      return;
    }

    clearTimeout(this._collapseAnimationTimeout);

    this.isCollapsed = collapsed;

    this.container.classList.toggle('map-hidden', collapsed);
    document.body.classList.toggle('map-mode', !collapsed);

    this._collapseAnimationTimeout = setTimeout(function() {
      google.maps.event.trigger(this.map, 'resize');
    }.bind(this), ANIMATION_DURATION);
  };

  window.MapElement = MapElement;
})();
