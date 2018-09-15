<!-- @format -->

# JS-Carousel

Vanilla JS carousel for the web.

---

The carousel should be as self-sufficient as possible. Though it doesn't know and it doesn't care what you put inside in, it will do it's job the best it could. But it leaves it up to you to style whatever you put inside it. The carousel assumes that each item has width equal to the width of the container.

The carousel supports swipes to navigate around.

# Usage

#### html

Add the following inside the head tag

```html
<script src=""></script>
```

```html
<div id="carousel-container">
  <img src="https://www.anime-evo.net/wp-content/uploads/2015/10/One-Punch-Man-01-03.jpg">
  <img src="http://mangalerie.fr/wp-content/uploads/2016/01/Saitama_OK.jpg">
  <img src="https://twosensei.files.wordpress.com/2015/10/one-punch-man-02-1080p-mkv_00005.png">
  <img src="https://otakukart.com/animeblog/wp-content/uploads/2016/07/One-Punch-Man-05-Large-03.jpg">
</div>
<!-- then somewhere down below -->

<script>
  jscarousel(document.getElementById('carousel-container'), {
    animationSpeed: 500,
    itemDuration: 1500
  });
</script>
```

The first parameter that `jscarousel` function expects is an `HTML element` that's the carousel. The second parameter is a configuration object with the following keys:

- `animationSpeed` is the speed (in terms of milliseconds) of the transition animation.
- `itemDuration` is the amount of time (in terms of milliseconds) it has to wait before transitioning to the next item.
