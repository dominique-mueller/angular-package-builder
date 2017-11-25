<div align="center">

# angular-package-builder

**Package your Angular libraries**

[![npm version](https://img.shields.io/npm/v/angular-package-builder.svg?maxAge=3600&style=flat)](https://www.npmjs.com/package/angular-package-builder)
[![dependency status](https://img.shields.io/david/dominique-mueller/angular-package-builder.svg?maxAge=3600&style=flat)](https://david-dm.org/dominique-mueller/angular-package-builder)
[![travis ci build status](https://img.shields.io/travis/dominique-mueller/angular-package-builder/master.svg?maxAge=3600&style=flat)](https://travis-ci.org/dominique-mueller/angular-package-builder)
[![Known Vulnerabilities](https://snyk.io/test/github/dominique-mueller/angular-package-builder/badge.svg)](https://snyk.io/test/github/dominique-mueller/angular-package-builder)
[![license](https://img.shields.io/npm/l/angular-package-builder.svg?maxAge=3600&style=flat)](https://github.com/dominique-mueller/automatic-release/LICENSE)

</div>

<br><br>

## What it does

These days, setting up build chains for frontend projects requires lots of knowledge and time. Especially when developing libraries for the **Angular ecosystem**, there is a fair amount of things to do in order to get an Angular library published just right.

The **Angular Package Builder** is here to help. Once configured, this NodeJS-based command line tool will build your Angular library with a single command, allowing developers to focus on the important things - developing! Under the hood, **angular-package-builder** will:

- inline (and compile) external resources (HTML, CSS, SASS)
- compile TypeScript sources into JavaScript (ES2015, ES5)
- create JavaScript bundles (ESM2015, ESM5, UMD)

> Please note that the **Angular Package Builder** only builds libraries for **Angular 5.x**. Previous Angular versions are not supported.

![Angular Package Builder Preview](/docs/preview.png?raw=true)

<br><br>

## How to install

You can get **angular-package-builder** via **npm** by either adding it as a new devDependency to your `package.json` file and running
`npm install`, or running the following command:

``` bash
npm install angular-package-builder --save-dev
```

### Requirements

- **angular-package-builder** requires at least **NodeJS 7.6** (or higher). *Earlier 7.x versions of NodeJS (7.0 to 7.5) might also work when
executing **angular-package-builder** using the `--harmony-async-await` flag.*

- **angular-package-builder** requires all its peer dependencies (*@angular/compiler-cli*, *@angular-compiler*, *typescript*) to be installed in the compatible versions (see the *package.json* file for more details).

<br><br>

## How to use

In most cases, integrating **angular-package-builder** into a project is very straightforward. First, make sure to call **angular-package-builder** within one of the scripts of your `package.json` file. For instance:

``` json
{
  "scripts": {
    "builder": "angular-package-builder"
  }
}
```

Then, create a `.angular-package.json` file in your project's root folder, and fill it with the following content (using your custom configuration values, of course):

``` json
{
  "$schema": "node_modules/angular-package-builder/angular-package.schema.json",
  "entryFile": "lib/src/index.ts",
  "outDir": "dist"
}
```

<br>

### Advanced configuration

TODO

<br>

### CLI commands

TODO

<br><br>

## Creator

**Dominique Müller**

- E-Mail: **[dominique.m.mueller@gmail.com](mailto:dominique.m.mueller@gmail.com)**
- Website: **[www.devdom.io](https://www.devdom.io/)**
- Twitter: **[@itsdevdom](https://twitter.com/itsdevdom)**
