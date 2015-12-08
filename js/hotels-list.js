/* global Hotel: true, Gallery: true, MapElement: true */

'use strict';

(function() {
  var container = document.querySelector('.hotels-list');
  var activeFilter = 'filter-all';
  var hotels = [];
  var filteredHotels = [];
  var renderedHotels = [];
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

  map.onload = function() {
    map.render();
  };
  map.initializeAPI();

  /**
   * Отрисовка списка отелей.
   * @param {Array.<Object>} hotelsToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderHotels(hotelsToRender, pageNumber, replace) {
    if (replace) {
      var el;
      while ((el = renderedHotels.shift())) {
        el.remove();
        el.onGalleryClick = null;
      }
    }

    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageHotels = hotelsToRender.slice(from, to);

    renderedHotels = renderedHotels.concat(pageHotels.map(function(hotel) {
      var hotelElement = new Hotel(hotel);
      hotelElement.render(container);

      // Галерея показывает фотографии отеля. Это значит, что при нажатии на отель,
      // в галерею должны передаваться данные об отеле. Фактически, галерея является
      // еще одним способом показать отель на странице.

      // NB! Здесь, для создания и обработки кастомного DOM-события используется
      // коллбэк, который переопределяется вне объекта. Но способов реализовать
      // требуемое поведение несколько:
      //
      // 1. Выполнять событие на window с заданным неймспейсом или специальным
      //    названием. Система pub/sub работает примерно по такому же принципу:
      //    все события и подписки происходят на одном элементе.
      //
      // 2. Написать свою обработку событий. Это самый распространенный путь.
      //    Кто-то идет сложным путем и пишет сложную эмуляцию системы событий
      //    (Google Closure Library), кто-то упрощенную, без фаз и прочих
      //    сложных понятий. Кто-то эмулирует события через встроенные
      //    неизпользуемые DOM-элементы или DOM-элемент компонента.
      //
      // 3. Добавить публичный коллбэк вроде onGalleryClick. Этот подход напоминает
      //    DOM Level 0, однако, в отличие от него, в этом подходе можно реализовать
      //    множественную обработку событий. Правда в этом случае, нельзя говорить
      //    о событиях, поскольку это именно коллбэки.
      //
      hotelElement.onGalleryClick = function() {
        gallery.data = hotelElement._data;
        gallery.show();
      };

      return hotelElement;
    }));
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

    var selectedElement = document.querySelector('#' + activeFilter);
    if (selectedElement) {
      selectedElement.classList.remove('hotel-filter-selected');
    }

    document.querySelector('#' + id).classList.add('hotel-filter-selected');

    filteredHotels = hotels.slice(0);

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
