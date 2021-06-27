# React Stonemason
This is based on react-photo-gallery. It has added support for things other than images, and the column layout was removed, as there are better options available for a responsive column layout.

<!--[![Join the chat at https://gitter.im/react-photo-gallery/Lobby](https://badges.gitter.im/react-photo-gallery/Lobby.svg)](https://gitter.im/react-photo-gallery/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) -->

<!-- [![npm version](https://badge.fury.io/js/react-photo-gallery.svg)](https://badge.fury.io/js/react-photo-gallery) -->

<!-- ![npm downloads](https://img.shields.io/npm/dt/react-photo-gallery.svg) -->

<!-- [![Build Status](https://travis-ci.org/neptunian/react-photo-gallery.svg?branch=master)](https://travis-ci.org/neptunian/react-photo-gallery) -->

<!-- [![Coverage Status](https://coveralls.io/repos/github/neptunian/react-photo-gallery/badge.svg?branch=master)](https://coveralls.io/github/neptunian/react-photo-gallery?branch=master) -->

<!-- [![Dependency Status](https://david-dm.org/neptunian/react-photo-gallery.svg)](https://david-dm.org/neptunian/react-photo-gallery) -->

* Maintains the original aspect ratio of your components (usually images)
* Creates a masonry or justified grid
* SSR app compatible
* Supports child components

## Preview

<img alt="preview" src="https://live.staticflickr.com/65535/40680327133_6f6218bfa3.jpg" />


## Installation

```
yarn add react-stonemason
```

## API Documentation

```
<Stonemason>
  <img src="/fred.jpg" width={400} height={800} key="fred" />
</Stonemason>
```

To build some examples locally, git clone and run:

```
yarn install
yarn start
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Minimal Setup Example

```jsx

const photos = [
  {
    src: 'http://example.com/example/img1.jpg',
    width: 4,
    height: 3
  },
  {
    src: 'http://example.com/example/img2.jpg',
    width: 1,
    height: 1
  }
];

<Stonemason>
    {photos.map(a => <img src={a.src} width={a.width} height={a.height} key={a.src} />)}
</Stonemason>
```

## How It Works

Note: this was all already from react-photo-gallery. This is just kept from their section.

This layout uses an algorithm adapted from the Knuth and Plass line breaking algorithm.  It uses a graph to calculate the single best layout where each photo to break on is represented by a node and each edge is represented by a row. The cost of the edge is determined by the user provided `targetRowHeight` vs the row height calculated if it were to break on this node/photo. What you end up with is a layout with rows that are similar in height and photos that are not being stretched or shrunken abnormally as is what happens in a naive implementation. This solves the issue of panoramas shrinking rows or having stragglers or stretched images at the last row, instead creating a justified grid.  To make sure it's speedy the graph is being built as the shortest path is being calculated so the entire adjacency list is not calculated ahead of time. You can control how many neighboring nodes that Dijkstra's algorithm will search when it's visiting a node by adjusting the `limitNodeSearch` property, but it's recommended you use the default algorithm. See documentation for recommendations.

Inspired by [this blog article](http://blog.vjeux.com/2014/image/google-plus-layout-find-best-breaks.html) and this [Google Photos blog article](https://medium.com/google-design/google-photos-45b714dfbed1) (under 2. Justified Gallery).


## Thanks

Special thanks to [Christopher Chedeau](https://blog.vjeux.com/) for [writing about this interesting algorithm](http://blog.vjeux.com/2014/image/google-plus-layout-find-best-breaks.html) and whos code served as a starting off point.