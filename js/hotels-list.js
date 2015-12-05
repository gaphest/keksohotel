/* global Hotel: true, Gallery: true */

'use strict';

(function() {
  var container = document.querySelector('.hotels-list');
  var activeFilter = 'filter-all';
  var hotels = [];
  var filteredHotels = [];
  var currentPage = 0;
  var PAGE_SIZE = 9;
  var gallery = new Gallery();

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

  /**
   * Отрисовка списка отелей.
   * @param {Array.<Object>} hotelsToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderHotels(hotelsToRender, pageNumber, replace) {
    if (replace) {
      // Обработчики кликов по отелям до сих пор не удалены
      var renderedElements = container.querySelectorAll('.hotel');
      [].forEach.call(renderedElements, function(el) {
        el.removeEventListener('click', _onClick);
        // Почему бы его тут же и не убрать?
        container.removeChild(el);
      });
    }

    var fragment = document.createDocumentFragment();

    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageHotels = hotelsToRender.slice(from, to);

    pageHotels.forEach(function(hotel) {
      var hotelElement = new Hotel(hotel);
      hotelElement.render();
      fragment.appendChild(hotelElement.element);

      // Показ галереи должен происходить по клику на фон отеля
      hotelElement.element.addEventListener('click', _onClick);
    });

    container.appendChild(fragment);
  }

  /**
   * @param {Event} evt
   */
  function _onClick(evt) {
    evt.preventDefault();
    gallery.show();
  }

  /**
   * Установка выбранного фильтра
   * @param {string} id
   * @param {boolean=} force Флаг, при котором игнорируется проверка
   *     на повторное присвоение фильтра.
   */
  function setActiveFilter(id, force) {
    if (activeFilter === id && !force) {
      return;
    }

    var selectedElement = document.querySelector('#' + activeFilter);
    if (selectedElement) {
      selectedElement.classList.remove('hotel-filter-selected');
    }

    document.querySelector('#' + id).classList.add('hotel-filter-selected');

    filteredHotels = hotels.slice(0); // Копирование массива

    switch (id) {
      case 'filter-expensive':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return b.price - a.price;
        });
        break;

      case 'filter-cheap':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.price - b.price;
        });
        break;

      case 'filter-2stars':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.stars - b.stars;
        }).filter(function(item) {
          return item.stars > 2;
        });

        break;

      case 'filter-6rating':
        filteredHotels = filteredHotels.sort(function(a, b) {
          return a.rating - b.rating;
        }).filter(function(item) {
          return item.rating >= 6;
        });
        break;
    }

    currentPage = 0;
    renderHotels(filteredHotels, currentPage, true);

    activeFilter = id;
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
      updateLoadedHotels(loadedHotels);
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
})();
