# Changelog

Also see **[GitHub releases](https://github.com/dominique-mueller/angular-package-builder/releases)**.

<br>

## [2.0.0](https://github.com/dominique-mueller/angular-package-builder/releases/tag/2.0.0) (2018-07-03)

### Features

- **angular-package-json:** Add angular package JSON schema validation, add error handling ([#128](https://github.com/dominique-mueller/angular-package-builder/issues/128)) ([a938d73](https://github.com/dominique-mueller/angular-package-builder/commit/a938d73))
- **builder:** Add initial support for secondary entries & multiple libraries ([#101](https://github.com/dominique-mueller/angular-package-builder/issues/101)) ([e6cbfc5](https://github.com/dominique-mueller/angular-package-builder/commit/e6cbfc5)), closes [#98](https://github.com/dominique-mueller/angular-package-builder/issues/98) [#99](https://github.com/dominique-mueller/angular-package-builder/issues/99)
- **compatibility:** Add compatibility warnings ([#131](https://github.com/dominique-mueller/angular-package-builder/issues/131)) ([8d7dddc](https://github.com/dominique-mueller/angular-package-builder/commit/8d7dddc))
- **compatibility:** Extend Angular compatibility ([#86](https://github.com/dominique-mueller/angular-package-builder/issues/86)) ([cd50521](https://github.com/dominique-mueller/angular-package-builder/commit/cd50521)), closes [#84](https://github.com/dominique-mueller/angular-package-builder/issues/84)
- **compilation:** Emit esm5 and esm2015 build output to dist ([#85](https://github.com/dominique-mueller/angular-package-builder/issues/85)) ([3012fb5](https://github.com/dominique-mueller/angular-package-builder/commit/3012fb5)), closes [#83](https://github.com/dominique-mueller/angular-package-builder/issues/83)
- **errors:** Handle bundling errors, add tests ([#124](https://github.com/dominique-mueller/angular-package-builder/issues/124)) ([6217d53](https://github.com/dominique-mueller/angular-package-builder/commit/6217d53))
- **errors:** Handle compilation errors, update logging, add unit tests ([#123](https://github.com/dominique-mueller/angular-package-builder/issues/123)) ([0f6a2c7](https://github.com/dominique-mueller/angular-package-builder/commit/0f6a2c7))
- **errors:** Improve transformation error handling, add unit tests ([#122](https://github.com/dominique-mueller/angular-package-builder/issues/122)) ([3782615](https://github.com/dominique-mueller/angular-package-builder/commit/3782615))
- **logging:** Add logging ([#107](https://github.com/dominique-mueller/angular-package-builder/issues/107)) ([ae0813d](https://github.com/dominique-mueller/angular-package-builder/commit/ae0813d))
- **orchestration:** Add orchestration error handling, refactor test directory structure ([#127](https://github.com/dominique-mueller/angular-package-builder/issues/127)) ([d8d169e](https://github.com/dominique-mueller/angular-package-builder/commit/d8d169e))
- **package:** Add creation of package.json file incl. entry points ([#106](https://github.com/dominique-mueller/angular-package-builder/issues/106)) ([36b4e7a](https://github.com/dominique-mueller/angular-package-builder/commit/36b4e7a))
- **sass:** Add support for tilde-imports ([#136](https://github.com/dominique-mueller/angular-package-builder/issues/136)) ([b9ce564](https://github.com/dominique-mueller/angular-package-builder/commit/b9ce564))
- **warnings:** Add warning logging ([#126](https://github.com/dominique-mueller/angular-package-builder/issues/126)) ([0652e38](https://github.com/dominique-mueller/angular-package-builder/commit/0652e38))

### Bug Fixes

- **angular-package:** Fix build with custom entryFile & outDir paths ([#135](https://github.com/dominique-mueller/angular-package-builder/issues/135)) ([a0f0a1b](https://github.com/dominique-mueller/angular-package-builder/commit/a0f0a1b))
- **cleanup:** Add cleanup error handling ([#142](https://github.com/dominique-mueller/angular-package-builder/issues/142)) ([e30ae58](https://github.com/dominique-mueller/angular-package-builder/commit/e30ae58))
- **compile:** Fix typings not getting emitted to dist ([#111](https://github.com/dominique-mueller/angular-package-builder/issues/111)) ([5512ebb](https://github.com/dominique-mueller/angular-package-builder/commit/5512ebb))
- **resources:** Enhance HTML minifier to take line-breaking attributes into account ([#147](https://github.com/dominique-mueller/angular-package-builder/issues/147)) ([d6ec872](https://github.com/dominique-mueller/angular-package-builder/commit/d6ec872)), closes [#146](https://github.com/dominique-mueller/angular-package-builder/issues/146)
- **sourcemaps:** Fix sourcemap paths for build files & bundles, add source content ([#108](https://github.com/dominique-mueller/angular-package-builder/issues/108)) ([47cac52](https://github.com/dominique-mueller/angular-package-builder/commit/47cac52))

### Documentation

- **MIGRATION-GUIDE:** Add migration guide ([#138](https://github.com/dominique-mueller/angular-package-builder/issues/138)) ([0957cbc](https://github.com/dominique-mueller/angular-package-builder/commit/0957cbc))
- **README:** Improve documentation ([#148](https://github.com/dominique-mueller/angular-package-builder/issues/148)) ([ddd6103](https://github.com/dominique-mueller/angular-package-builder/commit/ddd6103)), closes [#54](https://github.com/dominique-mueller/angular-package-builder/issues/54)
- **README:** Update intro, how-to-install, pitfalls ([#137](https://github.com/dominique-mueller/angular-package-builder/issues/137)) ([bcbf534](https://github.com/dominique-mueller/angular-package-builder/commit/bcbf534)), closes [#87](https://github.com/dominique-mueller/angular-package-builder/issues/87)

### Refactoring

- Add typings for dependencies, refactor folder structure ([#105](https://github.com/dominique-mueller/angular-package-builder/issues/105)) ([08d890c](https://github.com/dominique-mueller/angular-package-builder/commit/08d890c))

### Tests

- Add single library tests w/ example ([#132](https://github.com/dominique-mueller/angular-package-builder/issues/132)) ([7c6f3e0](https://github.com/dominique-mueller/angular-package-builder/commit/7c6f3e0))
- Add test utilities, add package test for multiple dependent libraries ([#118](https://github.com/dominique-mueller/angular-package-builder/issues/118)) ([8ec4bb2](https://github.com/dominique-mueller/angular-package-builder/commit/8ec4bb2))
- Add testing matrix for Angular & TypeScript ([#129](https://github.com/dominique-mueller/angular-package-builder/issues/129)) ([b03496d](https://github.com/dominique-mueller/angular-package-builder/commit/b03496d))
- Enhance & extend test examples ([#109](https://github.com/dominique-mueller/angular-package-builder/issues/109)) ([0e394e9](https://github.com/dominique-mueller/angular-package-builder/commit/0e394e9))
- **external-resources:** Add tests for external resource inlining ([#121](https://github.com/dominique-mueller/angular-package-builder/issues/121)) ([22fd4b3](https://github.com/dominique-mueller/angular-package-builder/commit/22fd4b3))

### Reverts

- **compatibility:** Remove compatibility check ([#133](https://github.com/dominique-mueller/angular-package-builder/issues/133)) ([81467e8](https://github.com/dominique-mueller/angular-package-builder/commit/81467e8))

### BREAKING CHANGES

- **builder:** The Angular Package Builder now relies on the correctness of package.json dependencies (see MIGRATION GUIDE).
- **compatibility:** The build now depends on the installed version of the Angular Compiler CLI (see MIGRATION GUIDE).
- **compilation:** The build output has changed (see MIGRATION GUIDE).

<br>

## [1.0.3](https://github.com/dominique-mueller/angular-package-builder/releases/tag/1.0.3) (2018-03-22)

### Bug Fixes

- **logging:** Supress rollup warnings based on their codes ([#81](https://github.com/dominique-mueller/angular-package-builder/issues/81)) ([0f27bfb](https://github.com/dominique-mueller/angular-package-builder/commit/0f27bfb)), closes [#76](https://github.com/dominique-mueller/angular-package-builder/issues/76)

<br>

## [1.0.2](https://github.com/dominique-mueller/angular-package-builder/releases/tag/1.0.2) (2018-03-21)

### Bug Fixes

- **config:** Fix output file names for sub-modules ([#78](https://github.com/dominique-mueller/angular-package-builder/issues/78)) ([ee12970](https://github.com/dominique-mueller/angular-package-builder/commit/ee12970)), closes [#77](https://github.com/dominique-mueller/angular-package-builder/issues/77)
- **logging:** Supress rollup optimization warnings ([#79](https://github.com/dominique-mueller/angular-package-builder/issues/79)) ([7765313](https://github.com/dominique-mueller/angular-package-builder/commit/7765313)), closes [#76](https://github.com/dominique-mueller/angular-package-builder/issues/76)

### Documentation

- **pitfalls:** Add section on synthetic imports ([#80](https://github.com/dominique-mueller/angular-package-builder/issues/80)) ([7497095](https://github.com/dominique-mueller/angular-package-builder/commit/7497095)), closes [#75](https://github.com/dominique-mueller/angular-package-builder/issues/75)
- **README:** Remove typo in code example ([#47](https://github.com/dominique-mueller/angular-package-builder/issues/47)) ([432723a](https://github.com/dominique-mueller/angular-package-builder/commit/432723a))

<br>

## [1.0.1](https://github.com/dominique-mueller/angular-package-builder/releases/tag/1.0.1) (2018-01-18)

### Bug Fixes

- **angular:** Fix Angular 5.2 compatibility, enhance CI build matrix ([#41](https://github.com/dominique-mueller/angular-package-builder/issues/41)) ([efa9464](https://github.com/dominique-mueller/angular-package-builder/commit/efa9464)), closes [#40](https://github.com/dominique-mueller/angular-package-builder/issues/40)

### Documentation

- **README:** Add compatibility table ([#42](https://github.com/dominique-mueller/angular-package-builder/issues/42)) ([1f9f6f3](https://github.com/dominique-mueller/angular-package-builder/commit/1f9f6f3))
- **README:** Update how to use guide ([#39](https://github.com/dominique-mueller/angular-package-builder/issues/39)) ([de23f9a](https://github.com/dominique-mueller/angular-package-builder/commit/de23f9a))

<br>

## [1.0.0](https://github.com/dominique-mueller/angular-package-builder/releases/tag/1.0.0) (2017-12-03)

### Features

- Add initial project setup ([#1](https://github.com/dominique-mueller/angular-package-builder/issues/1)) ([8372230](https://github.com/dominique-mueller/angular-package-builder/commit/8372230))
- **build-compose:** Add build compose step ([#11](https://github.com/dominique-mueller/angular-package-builder/issues/11)) ([230e007](https://github.com/dominique-mueller/angular-package-builder/commit/230e007))
- **bundle:** Add full set of externals / globals ([#7](https://github.com/dominique-mueller/angular-package-builder/issues/7)) ([afccd5f](https://github.com/dominique-mueller/angular-package-builder/commit/afccd5f))
- **bundle:** Add JavaScript bundle generator ([#5](https://github.com/dominique-mueller/angular-package-builder/issues/5)) ([8ecf583](https://github.com/dominique-mueller/angular-package-builder/commit/8ecf583))
- **cli:** Add cli command, fix error messages ([#28](https://github.com/dominique-mueller/angular-package-builder/issues/28)) ([76df4e6](https://github.com/dominique-mueller/angular-package-builder/commit/76df4e6))
- **config:** Add config reader, apply custom config to tasks ([#15](https://github.com/dominique-mueller/angular-package-builder/issues/15)) ([776328c](https://github.com/dominique-mueller/angular-package-builder/commit/776328c))
- **config:** Add configuration file JSON schema ([#14](https://github.com/dominique-mueller/angular-package-builder/issues/14)) ([80d0918](https://github.com/dominique-mueller/angular-package-builder/commit/80d0918))
- **config:** Add create config task w/ package.json & gitignore reader ([#13](https://github.com/dominique-mueller/angular-package-builder/issues/13)) ([573231f](https://github.com/dominique-mueller/angular-package-builder/commit/573231f))
- **error-handling:** Add error handling, refactoring ([#26](https://github.com/dominique-mueller/angular-package-builder/issues/26)) ([0b32f0b](https://github.com/dominique-mueller/angular-package-builder/commit/0b32f0b))
- **in-memory-fs:** Add virtual filesystem to get rid of the temporary build folder ([#12](https://github.com/dominique-mueller/angular-package-builder/issues/12)) ([9303c88](https://github.com/dominique-mueller/angular-package-builder/commit/9303c88))
- **inline-resources:** Add inline resources task (HTML templates only) ([#2](https://github.com/dominique-mueller/angular-package-builder/issues/2)) ([4433e20](https://github.com/dominique-mueller/angular-package-builder/commit/4433e20))
- **inline-resources:** Add SASS compiler, add CSS minifier ([#17](https://github.com/dominique-mueller/angular-package-builder/issues/17)) ([e7cc85d](https://github.com/dominique-mueller/angular-package-builder/commit/e7cc85d))
- **inline-resources:** Find resources by parsing source files ([#16](https://github.com/dominique-mueller/angular-package-builder/issues/16)) ([c8f4874](https://github.com/dominique-mueller/angular-package-builder/commit/c8f4874))
- **logging:** Add basic logger ([#20](https://github.com/dominique-mueller/angular-package-builder/issues/20)) ([345c73c](https://github.com/dominique-mueller/angular-package-builder/commit/345c73c))
- **ts-compile:** Add automatic typings include ([#10](https://github.com/dominique-mueller/angular-package-builder/issues/10)) ([71768e9](https://github.com/dominique-mueller/angular-package-builder/commit/71768e9))
- **ts-compile:** Add typescript compilation step ([#4](https://github.com/dominique-mueller/angular-package-builder/issues/4)) ([895efa9](https://github.com/dominique-mueller/angular-package-builder/commit/895efa9))
- **version-check:** Add version check, extend test matrix ([#29](https://github.com/dominique-mueller/angular-package-builder/issues/29)) ([141b325](https://github.com/dominique-mueller/angular-package-builder/commit/141b325))

### Bug Fixes

- **compiler-options:** Fix compiler options merging ([#35](https://github.com/dominique-mueller/angular-package-builder/issues/35)) ([cf4b37a](https://github.com/dominique-mueller/angular-package-builder/commit/cf4b37a))
- **ignore:** Fix ignore paths to be relative to cwd ([#22](https://github.com/dominique-mueller/angular-package-builder/issues/22)) ([75ad1fd](https://github.com/dominique-mueller/angular-package-builder/commit/75ad1fd))
- **ignore:** Fix ignored patterns, update docs ([#36](https://github.com/dominique-mueller/angular-package-builder/issues/36)) ([2aba7a4](https://github.com/dominique-mueller/angular-package-builder/commit/2aba7a4))
- **inline-resources:** Add actual HTML minifier ([#9](https://github.com/dominique-mueller/angular-package-builder/issues/9)) ([1222270](https://github.com/dominique-mueller/angular-package-builder/commit/1222270))
- **sourcemaps:** Fix TypeScript sourcemaps ([#8](https://github.com/dominique-mueller/angular-package-builder/issues/8)) ([31e2101](https://github.com/dominique-mueller/angular-package-builder/commit/31e2101))
- **ts-compile:** Fix closure compiler annotations ([#6](https://github.com/dominique-mueller/angular-package-builder/issues/6)) ([cc201c6](https://github.com/dominique-mueller/angular-package-builder/commit/cc201c6))

### Styles

- **log:** Enhance logging output ([#33](https://github.com/dominique-mueller/angular-package-builder/issues/33)) ([fdb9bd9](https://github.com/dominique-mueller/angular-package-builder/commit/fdb9bd9))

### Documentation

- **README:** Update pitfalls section ([#34](https://github.com/dominique-mueller/angular-package-builder/issues/34)) ([363b289](https://github.com/dominique-mueller/angular-package-builder/commit/363b289))
- **README:** Write README, update package.json ([#31](https://github.com/dominique-mueller/angular-package-builder/issues/31)) ([7cdd120](https://github.com/dominique-mueller/angular-package-builder/commit/7cdd120))

### Refactoring

- Enforce consistent paths ([#23](https://github.com/dominique-mueller/angular-package-builder/issues/23)) ([8a32711](https://github.com/dominique-mueller/angular-package-builder/commit/8a32711))
- Move files, cleanup, improve comments ([#27](https://github.com/dominique-mueller/angular-package-builder/issues/27)) ([7b2de05](https://github.com/dominique-mueller/angular-package-builder/commit/7b2de05))
- Overall refactoring, simplification & cleanup ([#32](https://github.com/dominique-mueller/angular-package-builder/issues/32)) ([58f6a75](https://github.com/dominique-mueller/angular-package-builder/commit/58f6a75))
- Upgrade to Angular 5, refactoring ([#19](https://github.com/dominique-mueller/angular-package-builder/issues/19)) ([58179bb](https://github.com/dominique-mueller/angular-package-builder/commit/58179bb))
- **config:** Rename options, refactor TypeScript configuration ([#21](https://github.com/dominique-mueller/angular-package-builder/issues/21)) ([914a3a5](https://github.com/dominique-mueller/angular-package-builder/commit/914a3a5))
- **fs:** Refactor memory file system ([#25](https://github.com/dominique-mueller/angular-package-builder/issues/25)) ([03918fc](https://github.com/dominique-mueller/angular-package-builder/commit/03918fc))
- **inline-resources:** Refactor inline resources step ([#18](https://github.com/dominique-mueller/angular-package-builder/issues/18)) ([533966c](https://github.com/dominique-mueller/angular-package-builder/commit/533966c))

### Tests

- Add unit tests, configure Travis CI ([#24](https://github.com/dominique-mueller/angular-package-builder/issues/24)) ([dd4d44c](https://github.com/dominique-mueller/angular-package-builder/commit/dd4d44c))
- **integration:** Introduce integration test, update package output ([#30](https://github.com/dominique-mueller/angular-package-builder/issues/30)) ([30b5e77](https://github.com/dominique-mueller/angular-package-builder/commit/30b5e77))
