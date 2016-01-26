/* global google: true */

/**
 * @fileoverview Модуль для работы с картой Google.
 * @author Igor Alexeenko (igor.alexeenko@htmlacademy.ru)
 */

'use strict';

define(function() {
  /**
   * @param {google.maps.Size} tileSize
   * @constructor
   */
  var MapOverlay = function(tileSize) {
    this.tileSize = tileSize;
  };

  MapOverlay.prototype.getTile = window.getMapTile;


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
    this._onToggleClick = this._onToggleClick.bind(this);
  };

  /**
   * @type {Array.<google.maps.Marker>}
   * @private
   */
  MapElement.prototype._markers = null;

  /**
   * Инициализация API Google карт.
   */
  MapElement.prototype.initializeAPI = function() {
    window['__gmapscallback'] = function() {
      this.isLoaded = true;
      this._loadCallbacks.forEach(function(callback) {
        callback();
      });

      // Клик по переключателю напрямую влияет на состояние
      // элемента. При работе с адресной строкой, поведение
      // должно отличаться: клик должен менять только состояние
      // адресной строки, а карта должа сама принять решение
      // что делать при изменении адреса страницы.
      this._toggle.addEventListener('click', this._onToggleClick);
      window.addEventListener('hashchange', this._onHashChange.bind(this));
      this.restoreFromHash();
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
      scrollwheel: false,
      zoom: 12
    });

    this.map.overlayMapTypes.insertAt(0,
        new MapOverlay(new google.maps.Size(256, 256)));
  };

  /**
   * Коллбэк загрузки API карт Google.
   * @param {Function} fn
   */
  MapElement.prototype.onload = function(fn) {
    if (this.isLoaded) {
      fn();
      return;
    }

    if (!this._loadCallbacks) {
      this._loadCallbacks = [];
    }

    this._loadCallbacks.push(fn);
  };

  /**
  * @private
  */
  MapElement.prototype._onToggleClick = function() {
    location.hash = location.hash.indexOf('map') !== -1 ? '' : 'map';
  };

  /**
   * @private
   */
  MapElement.prototype._onHashChange = function() {
    this.restoreFromHash();
  };

  MapElement.prototype.restoreFromHash = function() {
    this.setCollapsed(location.hash.indexOf('map') === -1);
  };

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

    if (this._markers) {
      this._markers.forEach(function(marker) {
        marker.setMap(this.isCollapsed ? null : this.map);
      }, this);
    }

    this._collapseAnimationTimeout = setTimeout(function() {
      google.maps.event.trigger(this.map, 'resize');
    }.bind(this), ANIMATION_DURATION);
  };

  /**
   * @param {Array.<HotelData>} hotelsList
   */
  MapElement.prototype.setHotelsList = function(hotelsList) {
    this._markers = hotelsList.map(function(hotel) {
      return new google.maps.Marker({
        anchor: new google.maps.Point(8, 8),
        cursor: 'pointer',
        clickable: true,
        draggable: false,
        icon: 'img/marker-icon.png',
        position: new google.maps.LatLng(
          hotel.getProperty('location').lat,
          hotel.getProperty('location').lng),
        title: hotel.getProperty('name'),
        scaledSize: new google.maps.Size(16, 16),
        size: new google.maps.Size(28, 28)
      });
    });
  };

  return MapElement;
});
