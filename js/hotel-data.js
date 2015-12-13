/**
 * @fileoverview Объект для работы с данными для отеля (модель).
 * @author Igor Alexeenko (igor.alexeenko@htmlacademy.ru)
 */

'use strict';

define(function() {
  /**
   * @param {Object} data
   * @constructor
   */
  var HotelData = function(data) {
    this.params = data;
  };

  /**
   * @return {Array.<string>}
   */
  HotelData.prototype.getPictures = function() {
    return this.params.pictures;
  };

  /**
   * @return {number}
   */
  HotelData.prototype.getPrice = function() {
    return this.params.price;
  };

  /**
   * Подход из Backbone.js: получение свойства модели
   * по названию. Позволяет не создавать много оберток-
   * геттеров для каждого из свойств, но теряется гибкость
   * в хранении параметров и внешний код все-равно должен
   * хотя бы представлять структуру модели, что не делает
   * ее совсем абстрактной.
   * @param {string} name
   */
  HotelData.prototype.getProperty = function(name) {
    if (this.params[name]) {
      return this.params[name];
    }

    return null;
  };

  return HotelData;
});
