'use strict';

/**
 * Переменные, названные заглавными буквами, по соглашению, считаются
 * постоянными.
 * @constant {number}
 */
var TILE_SIZE = 256;

/** @constant {number} */
var DIAMOND_SIZE = 64;

/**
 * Функция getMapTile используется API карт Google для отрисовки прямоугольников
 * 256х256 поверх карты.
 * @param {google.maps.Coordinate} coordinate
 * @param {number} zoom
 * @param {Document} documentElement
 * @return {Element}
 */
var getMapTile = function(coordinate, zoom, documentElement) {
  // Воспользуемся функцией для отрисовки канваса поверх каждого прямоугольника.
  // Каждый канвас будет замощен ромбами, непрозрачность заливки
  // которых будет означать количество ресторанов под указанным ромбом.
  // Для простоты непрозрачность будем получать, генерируя случайное число.

  // Создание элемента канваса
  var canvasElement = document.createElement('canvas');

  // Каждый канвас должен по размерам соответствовать размеру прямоугольника,
  // в котором он находится.
  canvasElement.setAttribute('width', TILE_SIZE);
  canvasElement.setAttribute('height', TILE_SIZE);

  // Получение доступа к контексту отрисовки канваса
  var ctx = canvasElement.getContext('2d');

  var x;
  var y = -DIAMOND_SIZE / 2;
  var row = 1;

  while (y < TILE_SIZE) {
    x = row % 2 === 0 ? -DIAMOND_SIZE / 2 : 0;

    while (x < TILE_SIZE) {
      drawDiamond(ctx, DIAMOND_SIZE, x, y);
      x += DIAMOND_SIZE;
    }

    y += DIAMOND_SIZE / 2;
    row++;
  }


  return canvasElement;
};

/**
 * Рисует ромб, вписанный в прямоугольник с заданными координатами
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} size
 * @param {number} x
 * @param {number} y
 */
var drawDiamond = function(ctx, size, x, y) {
  ctx.beginPath();
  ctx.moveTo(x + size / 2, y);
  ctx.lineTo(x + size, y + size / 2);
  ctx.lineTo(x + size / 2, y + size);
  ctx.lineTo(x, y + size / 2);
  ctx.lineTo(x + size / 2, y);

  ctx.fillStyle = getRandomColor();
  ctx.fill();
};

var getRandomColor = function() {
  return 'rgba(30, 128, 30, ' + (Math.random() * 0.6).toFixed(1) + ')';
};
