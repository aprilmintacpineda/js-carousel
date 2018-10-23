/** @format */

window.jscarousel = function (targetCarousel, config) {
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
    if (!hasBeenStopped) {
      carouselPlayer = setTimeout(function () {
        if (!isPlaying && targetCarousel.parentElement) {
          isPlaying = true;
          let shouldReset = false;
          lastPage = currentPage;
          currentPage = currentPage + 1;

          /**
           * when the page is on the last prepended item, navigate
           * back to the first item but don't show animation
           */
          if (currentPage === maxPage + 1) {
            shouldReset = true;
            paginationContainer.children[0].style.backgroundColor = '#4ecbf4';
          } else {
            paginationContainer.children[currentPage - 1].style.backgroundColor = '#4ecbf4';
          }

          if (paginationContainer.children[lastPage - 1]) {
            paginationContainer.children[lastPage - 1].style.backgroundColor = '#1a84a8';
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

      let shouldReset = false;

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
          paginationContainer.children[0].style.backgroundColor = '#4ecbf4';
          paginationContainer.children[lastPage - 1].style.backgroundColor = '#1a84a8';
          shouldReset = 1;
        } else if (currentPage === 0) {
          paginationContainer.children[maxPage - 1].style.backgroundColor = '#4ecbf4';
          paginationContainer.children[0].style.backgroundColor = '#1a84a8';
          shouldReset = maxPage;
        } else {
          paginationContainer.children[currentPage - 1].style.backgroundColor = '#4ecbf4';
          paginationContainer.children[lastPage - 1].style.backgroundColor = '#1a84a8';
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

      // mouse
      addPassiveListener(ItemsWrapper, 'mousemove', swipeMove);
      addPassiveListener(ItemsWrapper, 'mouseup', swipeEnd);
      addPassiveListener(ItemsWrapper, 'mouseout', swipeEnd);
      // touch
      addPassiveListener(ItemsWrapper, 'touchmove', swipeMove);
      addPassiveListener(ItemsWrapper, 'touchend', swipeEnd);
    }
  }

  function addPassiveListener (target, event, handler) {
    let passiveListenerIsSupported = false;

    try {
      const options = {};

      Object.defineProperty(options, 'passive', {
        get: function get () {
          passiveListenerIsSupported = true;
        }
      });

      window.addEventListener('test', options, options);
      window.removeEventListener('test', options, options);
    } catch (err) {}

    if (passiveListenerIsSupported) {
      target.addEventListener(event, handler, {
        passive: true
      });
    } else {
      target.addEventListener(event, handler);
    }
  }

  function goToPage (ev) {
    if (!isPlaying) {
      isPlaying = true;
      clearTimeout(carouselPlayer);
      lastPage = currentPage;

      for (let a = 0; a < paginationContainer.children.length; a++) {
        if (paginationContainer.children[a] === ev.target) {
          currentPage = a + 1;
          break;
        }
      }

      paginationContainer.children[lastPage - 1].style.backgroundColor = '#1a84a8';
      paginationContainer.children[currentPage - 1].style.backgroundColor = '#4ecbf4';

      // enable animation
      ItemsWrapper.style.transition = transition;

      navigateToNextItem();
      isPlaying = false;
      playCarousel();
    }
  }

  const paginationContainer = document.createElement('div');
  const ItemsWrapper = document.createElement('div');
  const transition = 'transform ' + config.animationSpeed + 'ms';
  // computation
  let lastPage = 0;
  let currentPage = 1;
  let maxPage = targetCarousel.children.length;
  let containerWidth = targetCarousel.clientWidth;
  // autoplay
  let isPlaying = false;
  let carouselPlayer;
  // swipe
  let swipeStartXPosition = null;
  let hasBeenStopped = false;

  // apply styles to the elements
  targetCarousel.style = 'white-space: nowrap; overflow: hidden; position: relative;';
  paginationContainer.style =
    'position: absolute; bottom: 20px; left: 50%; transform: translate(-50%, 0);';
  ItemsWrapper.style = 'overflow: visible;';

  let maxLoop = targetCarousel.children.length;

  if (config.noClone) {
    maxPage -= 2;
    maxLoop -= 2;
    targetCarousel.children[0].style =
      'width: 100%; vertical-align: top; display: inline-block; white-space: pre-line;';
    ItemsWrapper.appendChild(targetCarousel.children[0]);
  }

  while (maxLoop) {
    maxLoop--;
    targetCarousel.children[0].style =
      'width: 100%; vertical-align: top; display: inline-block; white-space: pre-line;';
    ItemsWrapper.appendChild(targetCarousel.children[0]);

    // might as well create pagination elements now
    const Page = document.createElement('div');
    Page.style =
      'display: inline-block; width: 7px; height: 7px; background-color: #1a84a8; border-radius: 50%; margin-right: 10px; cursor: pointer;';
    Page.onclick = goToPage;
    paginationContainer.appendChild(Page);
  }

  if (!config.noClone) {
    // to be able to simulate an infinite scroll
    ItemsWrapper.appendChild(ItemsWrapper.children[0].cloneNode(true));
    ItemsWrapper.prepend(ItemsWrapper.children[maxPage - 1].cloneNode(true));
  } else {
    targetCarousel.children[0].style =
      'width: 100%; vertical-align: top; display: inline-block; white-space: pre-line;';
    ItemsWrapper.appendChild(targetCarousel.children[0]);
  }

  // replace the container with the built carousel
  targetCarousel.innerHTML = '';
  targetCarousel.appendChild(ItemsWrapper);
  targetCarousel.appendChild(paginationContainer);

  // initially go to the first item
  paginationContainer.children[0].style.backgroundColor = '#4ecbf4';
  navigateToNextItem();
  playCarousel();

  // add listeners

  // this is the only guy around that calls preventDefault
  ItemsWrapper.addEventListener('dragstart', function (ev) {
    ev.preventDefault();
  });

  addPassiveListener(ItemsWrapper, 'mousedown', swipeStart);
  addPassiveListener(ItemsWrapper, 'touchstart', swipeStart);

  addPassiveListener(window, 'resize', function () {
    isPlaying = true;
    clearTimeout(carouselPlayer);
    containerWidth = targetCarousel.clientWidth;
    navigateToNextItem();
    isPlaying = false;
    playCarousel();
  });

  return function () {
    clearTimeout(carouselPlayer);
    hasBeenStopped = true;
  };
};
