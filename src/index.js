/** @format */

window.jscarousel = function (CarouselContainer, config) {
  function navigateToNextItem () {
    const transform = 'translateX(-' + currentPage * containerWidth + 'px)';

    ItemsWrapper.style.webkitTransform = transform;
    ItemsWrapper.style.MozTransform = transform;
    ItemsWrapper.style.msTransform = transform;
    ItemsWrapper.style.OTransform = transform;
    ItemsWrapper.style.transform = transform;
  }

  function simulateInfiniteScroll (resetPage) {
    currentPage = resetPage;
    // disable animation
    ItemsWrapper.style.transition = '';
    navigateToNextItem();
  }

  function playCarousel () {
    carouselPlayer = setTimeout(function () {
      if (!isPlaying) {
        isPlaying = true;
        var shouldReset = false;
        lastPage = currentPage;
        currentPage = currentPage + 1;

        /**
         * when the page is on the last prepended item, navigate
         * back to the first item but don't show animation
         */
        if (currentPage === maxPage + 1) {
          shouldReset = true;
          PagesContainer.children[0].style.backgroundColor = '#4ecbf4';
        } else {
          PagesContainer.children[currentPage - 1].style.backgroundColor = '#4ecbf4';
        }

        if (PagesContainer.children[lastPage - 1]) {
          PagesContainer.children[lastPage - 1].style.backgroundColor = '#1a84a8';
        }

        // enable animation
        ItemsWrapper.style.transition = transition;

        // navigate to next item
        navigateToNextItem();

        setTimeout(function () {
          isPlaying = false;
          if (shouldReset) simulateInfiniteScroll(1);
        }, config.animationSpeed + 10);

        playCarousel();
      }
    }, config.itemDuration);
  }

  function resolveMouseX (ev) {
    return ev instanceof MouseEvent
      ? ev.clientX
      : ev.changedTouches[0].clientX || ev.changedTouches[0].pageX;
  }

  function swipeMove (ev) {
    if (swipeStartXPosition !== null) {
      const translateX =
        'translateX(-' +
        (currentPage * containerWidth + (swipeStartXPosition - resolveMouseX(ev))) +
        'px)';

      ItemsWrapper.style.webkitTransform = translateX;
      ItemsWrapper.style.MozTransform = translateX;
      ItemsWrapper.style.msTransform = translateX;
      ItemsWrapper.style.OTransform = translateX;
      ItemsWrapper.style.transform = translateX;
    }
  }

  function swipeEnd (ev) {
    if (swipeStartXPosition !== null) {
      ev.stopPropagation();

      var shouldReset = false;

      // enable animation
      ItemsWrapper.style.transition = transition;

      if (Math.abs(resolveMouseX(ev) - swipeStartXPosition) >= config.swipeThreshold) {
        lastPage = currentPage;

        if (resolveMouseX(ev) > swipeStartXPosition) {
          currentPage = currentPage - 1;
        } else {
          currentPage = currentPage + 1;
        }

        swipeStartXPosition = null;

        navigateToNextItem();

        if (currentPage === maxPage + 1) {
          PagesContainer.children[0].style.backgroundColor = '#4ecbf4';
          PagesContainer.children[lastPage - 1].style.backgroundColor = '#1a84a8';
          shouldReset = 1;
        } else if (currentPage === 0) {
          PagesContainer.children[maxPage - 1].style.backgroundColor = '#4ecbf4';
          PagesContainer.children[0].style.backgroundColor = '#1a84a8';
          shouldReset = maxPage;
        } else {
          PagesContainer.children[currentPage - 1].style.backgroundColor = '#4ecbf4';
          PagesContainer.children[lastPage - 1].style.backgroundColor = '#1a84a8';
        }
      } else {
        navigateToNextItem();
      }

      playCarousel();

      setTimeout(function () {
        isPlaying = false;
        if (shouldReset !== false) simulateInfiniteScroll(shouldReset);
      }, config.animationSpeed + 10);

      // cleaning listeners after execution
      ItemsWrapper.removeEventListener('mousemove', swipeMove);
      ItemsWrapper.removeEventListener('mouseout', swipeEnd);

      ItemsWrapper.removeEventListener('touchmove', swipeMove);
      ItemsWrapper.removeEventListener('touchend', swipeEnd);
    }
  }

  function swipeStart (ev) {
    if (!isPlaying) {
      isPlaying = true;
      clearTimeout(carouselPlayer);
      swipeStartXPosition = resolveMouseX(ev);

      // disable animation
      ItemsWrapper.style.transition = '';

      ItemsWrapper.addEventListener('mousemove', swipeMove);
      ItemsWrapper.addEventListener('mouseup', swipeEnd);
      ItemsWrapper.addEventListener('mouseout', swipeEnd);

      ItemsWrapper.addEventListener('touchmove', swipeMove);
      ItemsWrapper.addEventListener('touchend', swipeEnd);
    }
  }

  function preventDrag (ev) {
    ev.preventDefault();
  }

  const transition = 'transform ' + config.animationSpeed + 'ms';
  // computation
  var currentPage = 1;
  var lastPage = 0;
  var maxPage = CarouselContainer.children.length;
  var containerWidth = CarouselContainer.clientWidth;
  // autoplay
  var isPlaying = false;
  var carouselPlayer;
  // swipe
  var swipeStartXPosition = null;

  // the pagination element
  var PagesContainer = document.createElement('div');

  // wrapper element for all the items
  var ItemsWrapper = document.createElement('div');

  while (CarouselContainer.children.length) {
    CarouselContainer.children[0].style =
      'width: 100%; vertical-align: top; display: inline-block; white-space: pre-line;';
    ItemsWrapper.appendChild(CarouselContainer.children[0]);

    // might as well create pagination elements now
    var Page = document.createElement('div');
    Page.style =
      'display: inline-block; width: 7px; height: 7px; background-color: #1a84a8; border-radius: 50%; margin-right: 10px; cursor: pointer;';
    PagesContainer.appendChild(Page);

    Page.onclick = function goToPage (ev) {
      if (!isPlaying) {
        isPlaying = true;
        clearTimeout(carouselPlayer);
        lastPage = currentPage;

        for (var a = 0; a < PagesContainer.children.length; a++) {
          if (PagesContainer.children[a] === ev.target) {
            currentPage = a + 1;
            break;
          }
        }

        PagesContainer.children[lastPage - 1].style.backgroundColor = '#1a84a8';
        PagesContainer.children[currentPage - 1].style.backgroundColor = '#4ecbf4';

        // enable animation
        ItemsWrapper.style.transition = transition;

        navigateToNextItem();
        isPlaying = false;
        playCarousel();
      }
    };
  }

  // to be able to simulate an infinite scroll
  ItemsWrapper.appendChild(ItemsWrapper.children[0].cloneNode(true));
  ItemsWrapper.prepend(ItemsWrapper.children[maxPage - 1].cloneNode(true));

  // apply styles to the elements
  PagesContainer.style =
    'position: absolute; bottom: 20px; left: 50%; transform: translate(-50%, 0);';
  CarouselContainer.style = 'white-space: nowrap; overflow: hidden; position: relative;';
  ItemsWrapper.style = 'overflow: visible;';

  // replace the container with the built carousel
  CarouselContainer.innerHTML = '';
  CarouselContainer.appendChild(ItemsWrapper);
  CarouselContainer.appendChild(PagesContainer);

  // initially go to the first item
  PagesContainer.children[0].style.backgroundColor = '#4ecbf4';
  navigateToNextItem();
  playCarousel();

  // add listeners
  ItemsWrapper.addEventListener('mousedown', swipeStart);
  ItemsWrapper.addEventListener('touchstart', swipeStart);
  ItemsWrapper.addEventListener('dragstart', preventDrag);

  window.addEventListener('resize', function () {
    isPlaying = true;
    clearTimeout(carouselPlayer);
    containerWidth = CarouselContainer.clientWidth;
    navigateToNextItem();
    isPlaying = false;
    playCarousel();
  });
};
