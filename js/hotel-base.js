/**
 * @fileoverview Базовый объект для работы с отелями. Определяет общие
 * методы для всех представлений отеля.
 * @author Igor Alexeenko (igor.alexeenko@htmlacademy.ru)
 */

'use strict';

(function() {
  /**
   * @constructor
   */
  var HotelBase = function() {};

  /** @type {?HotelData} */
  HotelBase.prototype._data = null;

  HotelBase.prototype.render = function() {};

  HotelBase.prototype.remove = function() {};

  /**
   * @param {HotelData|null} data
   */
  HotelBase.prototype.setData = function(data) {
    this._data = data;
  };

  /**
   * @return {?HotelData}
   */
  HotelBase.prototype.getData = function() {
    return this._data;
  };

  window.HotelBase = HotelBase;
})();
