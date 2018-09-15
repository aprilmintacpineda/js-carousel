<!-- @format -->

# JS-Carousel

Vanilla JS carousel for the web. [See demo](https://aprilmintacpineda.github.io/js-carousel/).

---

The carousel should be as self-sufficient as possible. Though it doesn't know and it doesn't care what you put inside in, it will do it's job the best it could. But it leaves it up to you to style whatever you put inside it. The carousel assumes that each item has width equal to the width of the container.

The carousel supports swipes to navigate around.

# Usage

## with html

Add the following inside the head tag

```html
<script src="https://www.unpkg.com/js-carousel@latest/lib/index.min.js"></script>
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

## with npm

`npm i -s js-carousel`.

```html
<div id="carousel-container">
  <img src="https://www.anime-evo.net/wp-content/uploads/2015/10/One-Punch-Man-01-03.jpg">
  <img src="http://mangalerie.fr/wp-content/uploads/2016/01/Saitama_OK.jpg">
  <img src="https://twosensei.files.wordpress.com/2015/10/one-punch-man-02-1080p-mkv_00005.png">
  <img src="https://otakukart.com/animeblog/wp-content/uploads/2016/07/One-Punch-Man-05-Large-03.jpg">
</div>
```

somewhere in your js file.

```js
import jscarousel from 'js-carousel';

jscarousel(document.getElementById('carousel-container'), {
  animationSpeed: 500,
  itemDuration: 1500
});
```

Make sure to load the js file after the target element has loaded.

## With ReactJS / InfernoJS

In your main entry file:

```js
import jscarousel from 'js-carousel';
```

In your carousel component:

```jsx
class myComponent extends Component {
  componentDidMount () {
    jscarousel(this.carouselContainer, {
      animationSpeed: 500,
      itemDuration: 1500
    });
  }

  render () {
    return (
      <div ref={el => {
        this.carouselContainer = el;
      }}>
        <img src="https://www.anime-evo.net/wp-content/uploads/2015/10/One-Punch-Man-01-03.jpg">
        <img src="http://mangalerie.fr/wp-content/uploads/2016/01/Saitama_OK.jpg">
        <img src="https://twosensei.files.wordpress.com/2015/10/one-punch-man-02-1080p-mkv_00005.png">
        <img src="https://otakukart.com/animeblog/wp-content/uploads/2016/07/One-Punch-Man-05-Large-03.jpg">
      <div>
    );
  }
}
```

Or you can use [react-js-carousel](https://github.com/aprilmintacpineda/react-js-carousel) or [inferno-carousel](https://github.com/aprilmintacpineda/inferno-carousel).
