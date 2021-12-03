# [1.9.0](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.8.2...v1.9.0) (2021-12-03)


### Features

* allow to disable keyboard navigation ([4bfa6ee](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/4bfa6ee1052c896f43120beb8889096ab1428157))

## [1.8.2](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.8.1...v1.8.2) (2021-12-02)


### Bug Fixes

* fix ghost click not working ([c97e3f7](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/c97e3f72a210547036daf89ab785a87596a9290d))

## [1.8.1](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.8.0...v1.8.1) (2021-12-01)


### Bug Fixes

* allow ghost click directive to be used outside carousel ([acd3e39](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/acd3e392acf775b0da56eaffd64607f65d0a386b))

# [1.8.0](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.7.0...v1.8.0) (2021-07-19)


### Features

* allow to pass nullish values to carousel config input ([563e988](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/563e988288980ca3275f2c37222841b0286b9377))
* remove peer dependency of hammerjs in favor of pointer events ([5d03ec4](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/5d03ec4925236d546736dccd766502c72a78a4fd))

# [1.7.0](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.6.1...v1.7.0) (2021-04-29)


### Features

* allow to modify autorecalculate debounce time ([2e9cf12](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/2e9cf128ff421e1c7fe7d46f64962bf21129b815))

## [1.6.1](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.6.0...v1.6.1) (2021-04-28)


### Bug Fixes

* allow partial config ([734c396](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/734c3963f0cb1a67acdbd33968cf1989c635aa02))

# [1.6.0](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.5.1...v1.6.0) (2021-04-28)


### Bug Fixes

* fix lint ([8a83a5b](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/8a83a5ba99036efa2145427c51f00a7faa304941))
* fix ngPreventGhostClick not preventing routerLink navigation ([f75fdfc](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/f75fdfc4adeae16caa48fe2cbcc328c370b1d562))
* fix programmatic next not resetting autoplay timer ([b691d63](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/b691d6318829e9f3de5521921df7a05aa9ad7282))
* listen to element resize if ResizeObserver is available ([06dc294](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/06dc294be63f772ac4d7d6de89d5bcd0e0df6f25))
* narrow check to set tabindex only on elements ([69c277e](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/69c277e7e9d6767b3a2c71646e0561be910e8a69))


### Features

* allow Angular version 12.0.0 ([3684d9f](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/3684d9fa44580203131db37d1dcf7cad81745bc6))
* allow to get current slide index ([202e54f](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/202e54fbf1801606753347993c97aa11d2a9f6e0))
* don't animate when page is not active ([424928a](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/424928a9378a6c73e61a207fdf4aadf6f722918d))
* introduce active slide direction ([48f7ce4](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/48f7ce44f4074f9969c88259619def00b52b5537))
* introduce typecheck for ng-template by providing a carousel reference to ngCarouselSlide input ([6a172b1](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/6a172b1e44d234c912e3a4afbb161076da4d462e))
* introduce typed config ([9d043a6](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/9d043a63935960b465c6db76d3c64881a36bda22))
* stretch carousel to take available height ([9d5bc81](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/9d5bc81dd566a9478cbf29df0970e597d68b626d))

## [1.5.1](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.5.0...v1.5.1) (2020-09-03)


### Bug Fixes

* fix empty carousel initialization ([46a6808](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/46a68080b4744a181cb4d7607ef5009e17e80485))

# [1.5.0](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.4.1...v1.5.0) (2020-08-24)


### Features

* bump deps ([2c18b7d](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/2c18b7d27e90dade981fd6bdeb6e41a6d3f590d5))
* bump peer deps ([fc79870](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/fc798707e800223a6061e2e39d75e0e50e895f3e))

## [1.4.1](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.4.0...v1.4.1) (2020-02-06)


### Bug Fixes

* postpone setIndex when no slides available ([25fd910](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/25fd9102a2003ce5012093e3c3a1a4a1d8a6c186))

# [1.4.0](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.12...v1.4.0) (2020-02-05)


### Bug Fixes

* end drag on pancancel ([765f2ea](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/765f2ea8940235131f06433c4ac79b1ce9a97ac7))


### Features

* export item index to slide template ([ada075c](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/ada075c8bd4515a67e76ffae42840fc7f2b3452b))

## [1.3.12](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.11...v1.3.12) (2019-10-09)


### Bug Fixes

* fix next and prev commands for non-loop carousels ([234c889](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/234c889))

## [1.3.11](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.10...v1.3.11) (2019-10-09)


### Bug Fixes

* check whether node is a text node before blocking ([8361aac](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/8361aac))

## [1.3.10](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.9...v1.3.10) (2019-09-26)


### Bug Fixes

* reupload to npm due to npm publish error ([3f00777](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/3f00777))

## [1.3.9](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.8...v1.3.9) (2019-09-26)


### Bug Fixes

* also listen for pancancel event ([51a0632](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/51a0632))
* pancancel for ghost click prevention ([0547be2](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/0547be2))

## [1.3.8](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.7...v1.3.8) (2019-09-26)


### Bug Fixes

* apply different scroll blocking technique ([57a1508](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/57a1508))

## [1.3.7](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.6...v1.3.7) (2019-09-26)


### Bug Fixes

* block scroll when panning carousel horizontally ([6b94b0d](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/6b94b0d))
* fix library 3rd party imports ([b83c36d](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/b83c36d))
* fix next/prev transitioning to wrong side ([69062c5](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/69062c5))

## [1.3.6](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.5...v1.3.6) (2019-09-10)


### Bug Fixes

* infinite loop on server rendering ([402b951](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/402b951))
* missing browser checks ([a385ddb](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/a385ddb))

## [1.3.5](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.4...v1.3.5) (2019-09-09)


### Bug Fixes

* don't listen browser events on server ([4efe117](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/4efe117))

## [1.3.4](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.3...v1.3.4) (2019-09-06)


### Bug Fixes

* fix server side code ([f320c0f](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/f320c0f))

## [1.3.3](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.2...v1.3.3) (2019-09-06)


### Bug Fixes

* hidden overflow on carousel engine ([6a3c42e](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/6a3c42e))

## [1.3.2](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.1...v1.3.2) (2019-09-06)


### Bug Fixes

* stop ghost click propagation ([0692153](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/0692153))

## [1.3.1](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.3.0...v1.3.1) (2019-09-06)


### Bug Fixes

* fix missing provider ([c46e05d](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/c46e05d))

# [1.3.0](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.2.4...v1.3.0) (2019-09-05)


### Features

* implement ghost click prevention ([b2bcd0a](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/b2bcd0a))

## [1.2.4](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.2.3...v1.2.4) (2019-09-05)


### Bug Fixes

* fix incorrect carousel height ([c5779d6](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/c5779d6))

## [1.2.3](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.2.2...v1.2.3) (2019-09-05)


### Bug Fixes

* allow empty slides initializer ([1faadbf](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/1faadbf))

## [1.2.2](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.2.1...v1.2.2) (2019-09-05)


### Bug Fixes

* remove redundant animations module ([ff5a78e](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/ff5a78e))

## [1.2.1](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.2.0...v1.2.1) (2019-09-05)


### Bug Fixes

* specify whitelisted dependency ([efd5eb8](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/efd5eb8))

# [1.2.0](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.1.0...v1.2.0) (2019-09-04)


### Features

* specify repository ([913ba30](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/913ba30))

# [1.1.0](https://github.com/VagrantAI-c/ng-carousel-cdk/compare/v1.0.0...v1.1.0) (2019-08-05)


### Features

* trigger initial release ([dc674c2](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/dc674c2))

# 1.0.0 (2019-08-04)


### Features

* add missing package ([9a76202](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/9a76202))
* initial release ([8ad23b5](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/8ad23b5))
* initial release, second attempt ([0ea55ce](https://github.com/VagrantAI-c/ng-carousel-cdk/commit/0ea55ce))
