'use strict';

requirejs.config({
  baseUrl: 'js'
});

define([
  'hotel',
  'gallery',
  'map',
  'hotel-data',
  'form-validation'
], function(Hotel, Gallery, MapElement, HotelData) {
  var container = document.querySelector('.hotels-list');
  var activeFilter = localStorage.getItem('activeFilter') || 'filter-all';
  var hotels = [];
  var filteredHotels = [];
  var renderedElements = [];
  var currentPage = 0;
  var PAGE_SIZE = 9;
  var gallery = new Gallery();
  var map = new MapElement(document.querySelector('.map'));

  var filters = document.querySelector('.hotels-filters');
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('hotel-filter')) {
      setActiveFilter(clickedElement.id);
    }
  });

  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      var footerCoordinates = document.querySelector('footer').getBoundingClientRect();
      var viewportSize = window.innerHeight;
      if (footerCoordinates.bottom - viewportSize <= footerCoordinates.height) {
        if (currentPage < Math.ceil(filteredHotels.length / PAGE_SIZE)) {
          renderHotels(filteredHotels, ++currentPage);
        }
      }
    }, 100);
  });

  getHotels();

  map.onload(function() {
    map.render();
  });
  map.initializeAPI();

  /**
   * Отрисовка списка отелей.
   * @param {Array.<Object>} hotelsToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderHotels(hotelsToRender, pageNumber, replace) {
    if (replace) {
      // Поскольку мы больше не работаем только с DOM-элементом
      // компоненты, нужно переписать удаление. Для начала нужно
      // сохранить все отрисованные компоненты в еще один массив.
      var el;
      while ((el = renderedElements.shift())) {
        container.removeChild(el.element);
        el.onClick = null;
        el.remove();
      }
    }

    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageHotels = hotelsToRender.slice(from, to);

    var fragment = document.createDocumentFragment();

    renderedElements = renderedElements.concat(pageHotels.map(function(hotel) {
      var hotelElement = new Hotel();
      hotelElement.setData(hotel);
      hotelElement.render();
      fragment.appendChild(hotelElement.element);

      hotelElement.onClick = function() {
        gallery.setData(hotelElement.getData());
        gallery.render();
      };

      return hotelElement;
    }));

    container.appendChild(fragment);
  }

  /**
   * Установка выбранного фильтра
   * @param {string} id
   * @param {boolean=} force Флаг, при котором игнорируется проверка
   * на повторное присвоение фильтра.
   */
  function setActiveFilter(id, force) {
    if (activeFilter === id && !force) {
      return;
    }

    var selectedElement = document.querySelector('.hotel-filter-selected');
    if (selectedElement) {
      selectedElement.classList.remove('hotel-filter-selected');
    }

    document.querySelector('#' + id).classList.add('hotel-filter-selected');

    filteredHotels = hotels.slice(0);

    switch (id) {
      case 'filter-expensive':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return b.getPrice() - a.getPrice();
        });
        break;

      case 'filter-cheap':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.getPrice() - b.getPrice();
        });
        break;

      case 'filter-2stars':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.getProperty('stars') - b.getProperty('stars');
        }).filter(function(item) {
          return item.getProperty('stars') > 2;
        });

        break;

      case 'filter-6rating':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.getProperty('rating') - b.getProperty('rating');
        }).filter(function(item) {
          return item.getProperty('rating') >= 6;
        });
        break;
    }

    currentPage = 0;
    renderHotels(filteredHotels, currentPage, true);

    activeFilter = id;
    localStorage.setItem('activeFilter', id);
  }

  /**
   * Загрузка списка отелей
   */
  function getHotels() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/hotels.json');
    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      var loadedHotels = JSON.parse(rawData);

      loadedHotels = loadedHotels.map(function(hotel) {
        return new HotelData(hotel);
      });

      updateLoadedHotels(loadedHotels);

      map.onload(function() {
        map.setHotelsList(loadedHotels);
      });
    };

    xhr.send();
  }

  /**
   * Сохранение списка отелей в переменную hotels, обновление счетчика отелей
   * и вызов фильтрации и отрисовки.
   * @param {Array.<Object>} loadedHotels
   */
  function updateLoadedHotels(loadedHotels) {
    hotels = loadedHotels;
    document.querySelector('.hotels-title-count-number').innerText = hotels.length;

    setActiveFilter(activeFilter, true);
  }
});
