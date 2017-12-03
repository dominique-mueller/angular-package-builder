# Changelog

Also see the **[release page](https://github.com/dominique-mueller/angular-package-builder/releases)**.

<br>

## [1.0.0](https://github.com/dominique-mueller/angular-package-builder/releases/tag/1.0.0) (2017-12-03)

### Bug Fixes

* **compiler-options:** Fix compiler options merging ([#35](https://github.com/dominique-mueller/angular-package-builder/issues/35)) ([cf4b37a](https://github.com/dominique-mueller/angular-package-builder/commit/cf4b37a))
* **ignore:** Fix ignore paths to be relative to cwd ([#22](https://github.com/dominique-mueller/angular-package-builder/issues/22)) ([75ad1fd](https://github.com/dominique-mueller/angular-package-builder/commit/75ad1fd))
* **ignore:** Fix ignored patterns, update docs ([#36](https://github.com/dominique-mueller/angular-package-builder/issues/36)) ([2aba7a4](https://github.com/dominique-mueller/angular-package-builder/commit/2aba7a4))
* **inline-resources:** Add actual HTML minifier ([#9](https://github.com/dominique-mueller/angular-package-builder/issues/9)) ([1222270](https://github.com/dominique-mueller/angular-package-builder/commit/1222270))
* **sourcemaps:** Fix TypeScript sourcemaps ([#8](https://github.com/dominique-mueller/angular-package-builder/issues/8)) ([31e2101](https://github.com/dominique-mueller/angular-package-builder/commit/31e2101))
* **ts-compile:** Fix closure compiler annotations ([#6](https://github.com/dominique-mueller/angular-package-builder/issues/6)) ([cc201c6](https://github.com/dominique-mueller/angular-package-builder/commit/cc201c6))

### Chores

* **git:** Add temporary dist folder to gitignore ([#3](https://github.com/dominique-mueller/angular-package-builder/issues/3)) ([e3d1a16](https://github.com/dominique-mueller/angular-package-builder/commit/e3d1a16))
* **test:** Cleanup jest setup ([#37](https://github.com/dominique-mueller/angular-package-builder/issues/37)) ([3a4cfea](https://github.com/dominique-mueller/angular-package-builder/commit/3a4cfea))

### Documentation

* **README:** Update pitfalls section ([#34](https://github.com/dominique-mueller/angular-package-builder/issues/34)) ([363b289](https://github.com/dominique-mueller/angular-package-builder/commit/363b289))
* **README:** Write README, update package.json ([#31](https://github.com/dominique-mueller/angular-package-builder/issues/31)) ([7cdd120](https://github.com/dominique-mueller/angular-package-builder/commit/7cdd120))

### Features

* Add initial project setup ([#1](https://github.com/dominique-mueller/angular-package-builder/issues/1)) ([8372230](https://github.com/dominique-mueller/angular-package-builder/commit/8372230))
* **build-compose:** Add build compose step ([#11](https://github.com/dominique-mueller/angular-package-builder/issues/11)) ([230e007](https://github.com/dominique-mueller/angular-package-builder/commit/230e007))
* **bundle:** Add full set of externals / globals ([#7](https://github.com/dominique-mueller/angular-package-builder/issues/7)) ([afccd5f](https://github.com/dominique-mueller/angular-package-builder/commit/afccd5f))
* **bundle:** Add JavaScript bundle generator ([#5](https://github.com/dominique-mueller/angular-package-builder/issues/5)) ([8ecf583](https://github.com/dominique-mueller/angular-package-builder/commit/8ecf583))
* **cli:** Add cli command, fix error messages ([#28](https://github.com/dominique-mueller/angular-package-builder/issues/28)) ([76df4e6](https://github.com/dominique-mueller/angular-package-builder/commit/76df4e6))
* **config:** Add config reader, apply custom config to tasks ([#15](https://github.com/dominique-mueller/angular-package-builder/issues/15)) ([776328c](https://github.com/dominique-mueller/angular-package-builder/commit/776328c))
* **config:** Add configuration file JSON schema ([#14](https://github.com/dominique-mueller/angular-package-builder/issues/14)) ([80d0918](https://github.com/dominique-mueller/angular-package-builder/commit/80d0918))
* **config:** Add create config task w/ package.json & gitignore reader ([#13](https://github.com/dominique-mueller/angular-package-builder/issues/13)) ([573231f](https://github.com/dominique-mueller/angular-package-builder/commit/573231f))
* **error-handling:** Add error handling, refactoring ([#26](https://github.com/dominique-mueller/angular-package-builder/issues/26)) ([0b32f0b](https://github.com/dominique-mueller/angular-package-builder/commit/0b32f0b))
* **in-memory-fs:** Add virtual filesystem to get rid of the temporary build folder ([#12](https://github.com/dominique-mueller/angular-package-builder/issues/12)) ([9303c88](https://github.com/dominique-mueller/angular-package-builder/commit/9303c88))
* **inline-resources:** Add inline resources task (HTML templates only) ([#2](https://github.com/dominique-mueller/angular-package-builder/issues/2)) ([4433e20](https://github.com/dominique-mueller/angular-package-builder/commit/4433e20))
* **inline-resources:** Add SASS compiler, add CSS minifier ([#17](https://github.com/dominique-mueller/angular-package-builder/issues/17)) ([e7cc85d](https://github.com/dominique-mueller/angular-package-builder/commit/e7cc85d))
* **inline-resources:** Find resources by parsing source files ([#16](https://github.com/dominique-mueller/angular-package-builder/issues/16)) ([c8f4874](https://github.com/dominique-mueller/angular-package-builder/commit/c8f4874))
* **logging:** Add basic logger ([#20](https://github.com/dominique-mueller/angular-package-builder/issues/20)) ([345c73c](https://github.com/dominique-mueller/angular-package-builder/commit/345c73c))
* **ts-compile:** Add automatic typings include ([#10](https://github.com/dominique-mueller/angular-package-builder/issues/10)) ([71768e9](https://github.com/dominique-mueller/angular-package-builder/commit/71768e9))
* **ts-compile:** Add typescript compilation step ([#4](https://github.com/dominique-mueller/angular-package-builder/issues/4)) ([895efa9](https://github.com/dominique-mueller/angular-package-builder/commit/895efa9))
* **version-check:** Add version check, extend test matrix ([#29](https://github.com/dominique-mueller/angular-package-builder/issues/29)) ([141b325](https://github.com/dominique-mueller/angular-package-builder/commit/141b325))

### Refactoring

* Enforce consistent paths ([#23](https://github.com/dominique-mueller/angular-package-builder/issues/23)) ([8a32711](https://github.com/dominique-mueller/angular-package-builder/commit/8a32711))
* Move files, cleanup, improve comments ([#27](https://github.com/dominique-mueller/angular-package-builder/issues/27)) ([7b2de05](https://github.com/dominique-mueller/angular-package-builder/commit/7b2de05))
* Overall refactoring, simplification & cleanup ([#32](https://github.com/dominique-mueller/angular-package-builder/issues/32)) ([58f6a75](https://github.com/dominique-mueller/angular-package-builder/commit/58f6a75))
* Upgrade to Angular 5, refactoring ([#19](https://github.com/dominique-mueller/angular-package-builder/issues/19)) ([58179bb](https://github.com/dominique-mueller/angular-package-builder/commit/58179bb))
* **config:** Rename options, refactor TypeScript configuration ([#21](https://github.com/dominique-mueller/angular-package-builder/issues/21)) ([914a3a5](https://github.com/dominique-mueller/angular-package-builder/commit/914a3a5))
* **fs:** Refactor memory file system ([#25](https://github.com/dominique-mueller/angular-package-builder/issues/25)) ([03918fc](https://github.com/dominique-mueller/angular-package-builder/commit/03918fc))
* **inline-resources:** Refactor inline resources step ([#18](https://github.com/dominique-mueller/angular-package-builder/issues/18)) ([533966c](https://github.com/dominique-mueller/angular-package-builder/commit/533966c))

### Styles

* **log:** Enhance logging output ([#33](https://github.com/dominique-mueller/angular-package-builder/issues/33)) ([fdb9bd9](https://github.com/dominique-mueller/angular-package-builder/commit/fdb9bd9))

### Tests

* Add unit tests, configure Travis CI ([#24](https://github.com/dominique-mueller/angular-package-builder/issues/24)) ([dd4d44c](https://github.com/dominique-mueller/angular-package-builder/commit/dd4d44c))
* **integration:** Introduce integration test, update package output ([#30](https://github.com/dominique-mueller/angular-package-builder/issues/30)) ([30b5e77](https://github.com/dominique-mueller/angular-package-builder/commit/30b5e77))

<br>

---

<sup>*Changelog generated automatically by [automatic-release](https://github.com/dominique-mueller/automatic-release).*</sup>
