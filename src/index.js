/** @format */

function jscarousel (CarouselContainer, config) {
  function navigateToNextItem () {
    ItemsWrapper.style.webkitTransform = `translateX(-${currentPage * containerWidth}px)`;
    ItemsWrapper.style.MozTransform = `translateX(-${currentPage * containerWidth}px)`;
    ItemsWrapper.style.msTransform = `translateX(-${currentPage * containerWidth}px)`;
    ItemsWrapper.style.OTransform = `translateX(-${currentPage * containerWidth}px)`;
    ItemsWrapper.style.transform = `translateX(-${currentPage * containerWidth}px)`;
  }

  function simulateInfiniteScroll (resetPage) {
    setTimeout(function resetCarousel () {
      isPlaying = false;
      currentPage = resetPage;
      // disable animation
      ItemsWrapper.style.transition = '';
      navigateToNextItem();
    }, config.animationSpeed + 10);
  }

  function playCarousel () {
    carouselPlayer = setTimeout(function tick () {
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
        ItemsWrapper.style.transition = `transform ${config.animationSpeed}ms`;

        // navigate to next item
        navigateToNextItem();

        if (shouldReset) {
          simulateInfiniteScroll(1);
        } else {
          isPlaying = false;
        }

        playCarousel();
      }
    }, config.itemDuration);
  }

  function swipeMove (ev) {
    ItemsWrapper.style.webkitTransform = `translateX(-${currentPage * containerWidth +
      (swipeStartXPosition - ev.x)}px)`;
    ItemsWrapper.style.MozTransform = `translateX(-${currentPage * containerWidth +
      (swipeStartXPosition - ev.x)}px)`;
    ItemsWrapper.style.msTransform = `translateX(-${currentPage * containerWidth +
      (swipeStartXPosition - ev.x)}px)`;
    ItemsWrapper.style.OTransform = `translateX(-${currentPage * containerWidth +
      (swipeStartXPosition - ev.x)}px)`;
    ItemsWrapper.style.transform = `translateX(-${currentPage * containerWidth +
      (swipeStartXPosition - ev.x)}px)`;
  }

  function swipeEnd (ev) {
    // enable animation
    ItemsWrapper.style.transition = `transform ${config.animationSpeed}ms`;

    lastPage = currentPage;

    if (ev.x > swipeStartXPosition) {
      currentPage = currentPage - 1;
    } else {
      currentPage = currentPage + 1;
    }

    navigateToNextItem();

    console.log(currentPage, lastPage);

    if (currentPage === maxPage + 1) {
      PagesContainer.children[0].style.backgroundColor = '#4ecbf4';
      PagesContainer.children[lastPage - 1].style.backgroundColor = '#1a84a8';
      simulateInfiniteScroll(1);
    } else if (currentPage === 0) {
      PagesContainer.children[maxPage - 1].style.backgroundColor = '#4ecbf4';
      PagesContainer.children[0].style.backgroundColor = '#1a84a8';
      simulateInfiniteScroll(maxPage);
    } else {
      PagesContainer.children[currentPage - 1].style.backgroundColor = '#4ecbf4';
      PagesContainer.children[lastPage - 1].style.backgroundColor = '#1a84a8';
    }

    // cleaning listeners after execution
    ItemsWrapper.removeEventListener('mousemove', swipeMove);
    ItemsWrapper.removeEventListener('mouseout', swipeEnd);

    ItemsWrapper.removeEventListener('touchcancel', swipeMove);
    ItemsWrapper.removeEventListener('touchend', swipeEnd);

    isPlaying = false;
    playCarousel();
  }

  function swipeStart (ev) {
    if (!isPlaying) {
      clearTimeout(carouselPlayer);

      isPlaying = true;
      swipeStartXPosition = ev.x;

      ItemsWrapper.style.transition = '';

      ItemsWrapper.addEventListener('mousemove', swipeMove);
      ItemsWrapper.addEventListener('mouseup', swipeEnd);
      ItemsWrapper.addEventListener('mouseout', swipeEnd);

      ItemsWrapper.addEventListener('touchcancel', swipeMove);
      ItemsWrapper.addEventListener('touchend', swipeEnd);
    }
  }

  function preventDrag (ev) {
    ev.preventDefault();
  }

  // computation
  var currentPage = 1;
  var lastPage = 0;
  var maxPage = CarouselContainer.children.length;
  var containerWidth = CarouselContainer.clientWidth;
  // autoplay
  var isPlaying = false;
  var carouselPlayer = false;
  // swipe
  var swipeStartXPosition = false;

  var carouselItemStyles = `
    width: 100%;
    vertical-align: top;
  `;
  var carouseLContainerStyles = `
    white-space: nowrap;
    overflow: hidden;
    position: relative;
  `;
  var pagesContainerStyles = `
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);
  `;
  var paginationStyles = `
    display: inline;
    padding: 2px 10px;
    background-color: #1a84a8;
    border-radius: 50%;
    margin-right: 10px;
    cursor: pointer;
  `;
  var itemsWrapperStyles = `
    overflow: visible;
  `;

  // the pagination element
  var PagesContainer = document.createElement('div');

  // wrapper element for all the items
  var ItemsWrapper = document.createElement('div');

  // apply styles to the elements
  PagesContainer.style = pagesContainerStyles;
  CarouselContainer.style = carouseLContainerStyles;
  ItemsWrapper.style = itemsWrapperStyles;

  for (var a = 0; a < maxPage; a++) {
    CarouselContainer.children[a].style = carouselItemStyles;
    ItemsWrapper.appendChild(CarouselContainer.children[a].cloneNode(true));

    // might as well create pagination elements now
    var Page = document.createElement('div');
    Page.style = paginationStyles;
    PagesContainer.appendChild(Page);

    Page.onclick = function goToPage (ev) {
      if (!isPlaying) {
        clearTimeout(carouselPlayer);
        isPlaying = true;
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
        ItemsWrapper.style.transition = `transform ${config.animationSpeed}ms`;

        navigateToNextItem();
        isPlaying = false;
        playCarousel();
      }
    };
  }

  // to be able to simulate an infinite scroll
  ItemsWrapper.prepend(CarouselContainer.children[maxPage - 1].cloneNode(true));
  ItemsWrapper.append(CarouselContainer.children[0].cloneNode(true));

  // replace the container with the built carousel
  CarouselContainer.innerHTML = '';
  CarouselContainer.appendChild(ItemsWrapper);
  CarouselContainer.appendChild(PagesContainer);

  // initially go to the first item
  PagesContainer.children[0].style.backgroundColor = '#4ecbf4';
  navigateToNextItem();

  // add listeners
  ItemsWrapper.addEventListener('mousedown', swipeStart);
  ItemsWrapper.addEventListener('touchstart', swipeStart);
  ItemsWrapper.addEventListener('dragstart', preventDrag);

  playCarousel();
}

window.jscarousel = jscarousel;
