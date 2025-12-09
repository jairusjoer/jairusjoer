---
title: 'Delightful Animations I: Gallery'
description: Explore how to implement smooth horizontal gallery scrolling animations using GSAP to create engaging visual experiences for image galleries and content carousels
date: 2025-05-26
---

In today's web development landscape, creating engaging user experiences often requires capabilities that go beyond traditional animation. In this new article series, we'll explore how to use popular animation libraries, such as [GSAP](https://gsap.com/) and [Anime.js](https://animejs.com/), to create delightful animations.

For this first gallery animation, I revisited a website I designed and developed in 2024 for the communications agency [neuwaerts](https://www.neuwaerts.de/). While working on this project, I explored and experimented extensively with animation patterns and applications.

[neuwaerts.de](https://www.neuwaerts.de/)

![](./assets/neuwaerts-gallery.mp4)

## Installing GSAP and the ScrollTrigger Plugin

In order to replicate the horizontal gallery scrolling animation, we first need to [install GSAP and the ScrollTrigger plugin](https://gsap.com/docs/v3/Installation/). Since all plugins are confined to the `gsap` package, we'll only have to install and manage one dependency per project.

```sh
npm install gsap
```

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

## **Setting up the Gallery Structure**

Once GSAP and the ScrollTrigger plugin are set up, we can start crafting the intended animation step by step. To start, we'll create a simple HTML gallery section identifiable by the `.gallery` class attribute.

```html
<section class="gallery">
  <img
    src="https://picsum.photos/720/720?random&2"
    width="720"
    height="480"
    alt=""
  />
  <img
    src="https://picsum.photos/720/720?random&3"
    width="720"
    height="480"
    alt=""
  />
  <img
    src="https://picsum.photos/720/720?random&4"
    width="720"
    height="480"
    alt=""
  />
  <img
    src="https://picsum.photos/720/720?random&5"
    width="720"
    height="480"
    alt=""
  />
  <img
    src="https://picsum.photos/720/720?random&6"
    width="720"
    height="480"
    alt=""
  />
</section>
```

## Performing the Gallery Animation

Next, we retrieve the gallery element and its last child element, then feed them into the [`gsap.to` tween](https://gsap.com/docs/v3/GSAP/Tween). The tween then performs a scroll-bound animation that translates the x-axis of the gallery element to a value equal to the negative of its scroll width minus the width of its last child element.

```ts
const gallery = document.querySelector('.gallery');

if (gallery) {
  const lastItem = gallery.children[gallery.children.length - 1];

  const scrollTween = gsap.to(gallery, {
    x: () => -(gallery.scrollWidth - lastItem.clientWidth),
    ease: 'none',
    scrollTrigger: {
      invalidateOnRefresh: true,
      trigger: gallery,
      start: 'center center',
      end: () => `+=${gallery.scrollWidth}px center`,
      scrub: true,
      pin: true,
    },
  });
}
```

Using the [ScrollTrigger plugin](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), we configure the trigger, [scrub](https://gsap.com/docs/v3/Plugins/ScrollTrigger/#scrub), and [pin](https://gsap.com/docs/v3/Plugins/ScrollTrigger/#pin) behaviors. The Scrub feature links the animation progress to the scroll bar, and the Pin feature sticks the animated element to the screen, similar to a fixed position.

![](./assets/gallery-1.mp4)

## **Adding Progressive Image Animations**

To enhance the visual impact, each image receives its own scroll-triggered animation. These animations use the [`containerAnimation`](https://gsap.com/docs/v3/Plugins/ScrollTrigger/#containerAnimation) property to synchronize with the main gallery movement.

```ts
const images = document.querySelectorAll('.gallery img');
for (const image of images) {
  gsap.from(image, {
    ease: 'none',
    opacity: 0,
    filter: 'blur(2rem)',
    scrollTrigger: {
      containerAnimation: scrollTween,
      trigger: image,
      start: 'left right',
      end: 'center center',
      scrub: true,
    },
  });
}
```

Although synchronizing animations may seem simple, determining the start and end points of an animation within its new context can be challenging. In this case, consider using the [markers](https://gsap.com/docs/v3/Plugins/ScrollTrigger/#markers) property of the ScrollTrigger plugin to visualize the endpoints.

![](./assets/tile-2.mp4)

And just like that, we implemented the foundation for a delightful, smooth, horizontal gallery scrolling animation using GSAP. From here on out, our animation journey has just begun, as we will delve into more animations and implementation patterns.

## Considering Best Practices

In the next article in the series, we'll delve into the details of best practices regarding animations. For now, take a moment to consider the following aspects that we will discuss later:

- **Accessibility**: Use the `prefers-reduced-motion` media query to respect user preferences and ensure that keyboard navigation with clear focus indicators and comprehensive ARIA labels for screen readers works properly.
- **Content Strategy**: Design robust fallback layouts that work seamlessly without JavaScript. Maintain the semantic HTML structure of critical content to ensure visibility and accessibility through traditional navigation patterns.
- **Performance Testing**: Continuously monitor frame rates across diverse devices, and use browser developer tools to identify potential bottlenecks. Consider using lazy loading strategies for large resources to maintain an optimal user experience.
- **Responsive Design**: Carefully design vertical layouts for mobile devices and implement touch-friendly controls for different screen sizes and interaction patterns. Test gesture-based navigation, and ensure horizontal scrolling works intuitively across various device orientations.

---

## TL;DR

Explore how to implement a horizontal gallery scrolling animation with progressive image animations using GSAP and its ScrollTrigger plugin. Also, learn what to consider when working with animations for a future basis.
