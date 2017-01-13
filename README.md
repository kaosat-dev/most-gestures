# most-gestures

[![GitHub version](https://badge.fury.io/gh/kaosat-dev%2Fmost-gestures.svg)](https://badge.fury.io/gh/kaosat-dev%2Fmost-gestures)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)
[![Build Status](https://travis-ci.org/kaosat-dev/most-gestures.svg)](https://travis-ci.org/kaosat-dev/most-gestures)
[![Dependency Status](https://david-dm.org/kaosat-dev/most-gestures.svg)](https://david-dm.org/kaosat-dev/most-gestures)
[![devDependency Status](https://david-dm.org/kaosat-dev/most-gestures/dev-status.svg)](https://david-dm.org/kaosat-dev/most-gestures#info=devDependencies)


> unified high level pointer gestures, using most.js

This is a set of pointer gesture helpers, unifying pointer apis accross browsers & mobile/desktop
works (and manually tested ) in :
- Chrome (desktop & mobile, MacOS & Android)
- Firefox
- Safari (desktop & mobile , MacOs & IOS)
- Ios & Android web views

It
- is coded in es6
- uses most.js observables
- provides relatively high level tools : ie taps, zooms , dragmoves

## Table of Contents

- [Background](#background)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Background

- uses the fantastic [regl](https://github.com/mikolalysenko/regl) (declarative stateless rendering)
- uses the also great [glsify](https://github.com/stackgl/glslify)

## Installation


```
npm install
```

## Usage

```
import {baseInteractionsFromEvents, pointerGestures} from 'most-gestures'

const element = document.getelementById("foo")
const baseInteractions = baseInteractionsFromEvents(element)

const gestures = pointerGestures(baseInteractions)

//now you can use:
/*gestures.taps : tap/click once & release quickly
gestures.dragMoves: press, keep pressed & move around
zooms: mouse wheel & pinch zoom alike
pointerMoves: simple moves*/

each one of those is an observable , so to react on taps you can do:

gestures.taps.forEach(function(e){
  console.log('tapped',e)
  })

// dragMoves also add a few extras to the event
gestures.dragMoves.forEach(function(e){
  console.log('tapped',e)
  })
```

## Contribute

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.


## License

[The MIT License (MIT)](https://github.com/kaosat-dev/most-gestures/blob/master/LICENSE)
(unless specified otherwise)
