<div align="center">

# angular-package-builder

**Packages your Angular 5+ library based on the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview).**

[![npm version](https://img.shields.io/npm/v/angular-package-builder.svg?maxAge=3600&style=flat)](https://www.npmjs.com/package/angular-package-builder)
[![dependency status](https://img.shields.io/david/dominique-mueller/angular-package-builder.svg?maxAge=3600&style=flat)](https://david-dm.org/dominique-mueller/angular-package-builder)
[![travis ci build status](https://img.shields.io/travis/dominique-mueller/angular-package-builder/master.svg?maxAge=3600&style=flat)](https://travis-ci.org/dominique-mueller/angular-package-builder)
[![Known Vulnerabilities](https://snyk.io/test/github/dominique-mueller/angular-package-builder/badge.svg)](https://snyk.io/test/github/dominique-mueller/angular-package-builder)
[![license](https://img.shields.io/npm/l/angular-package-builder.svg?maxAge=3600&style=flat)](https://github.com/dominique-mueller/automatic-release/LICENSE)

</div>

<br><br>

## What it does

These days, setting up build chains for frontend projects requires lots of knowledge and quite some time. Especially when developing libraries for the **Angular ecosystem**, there is a fair amount of things to do in order to get an Angular library published just right.

The **Angular Package Builder** is here to help. Once configured, this NodeJS-based command line tool will build your Angular library with a single command, allowing developers to focus on the important things - developing!

Under the hood, the **Angular Package Builder** will:

- inline (and compile) external resources (HTML, CSS, SASS)
- compile TypeScript sources into JavaScript (ES2015, ES5)
- create JavaScript bundles (ESM2015, ESM5, UMD)

> Please note that the **Angular Package Builder** only builds libraries for **Angular 5+**. Previous Angular versions are not supported.

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

Finally, reference your build output by adding the following to your `package.json` (changing file names and paths based on your project and its configuration):

``` json
{
  "typings": "./my-library.d.ts",
  "main": "./bundles/my-library.umd.js",
  "module": "./esm5/my-library.js",
  "es2015": "./esm2015/my-library.js","
}
```

> The **Angular Package Builder** only builds libraries from an Angular / JavaScript perspective. It's possible that you might have to setup a few extra build steps, for instance in order to compile global SASS, or copy assets / other files.

<br>

### Advanced configuration

Usually, the configuration described above should be working for most library projects. For special use cases, or more advanced configuration, you can extend your `.angular-package.json` file further.

#### TypeScript compiler options

One of the things you might want to configure specifically for your project is TypeScript. Popular options include `strictNullChecks`, `skipLibCheck` and `allowSyntheticDefaultImports`. For instance:

``` json
{
  "typescriptCompilerOptions": {
    "strictNullChecks": true
  }
}
```

See the **[TypeScript Compiler Options Documentation](https://www.typescriptlang.org/docs/handbook/compiler-options.html)** for the full list of available options.

> The following options cannot be changed: `declaration`, `emitDecoratorMetadata`, `experimentalDecorators`, `module`, `moduleResolution`, `newLine`, `outDir`, `rootDir`, `sourceRoot` and `target`.

#### Angular compiler options

Furthermore, you might also decide to configure the Angular compiler. Common options are `annotateForClosureCompiler`, `preserveWhitespaces` and `strictMetadataEmit`.

``` json
{
  "angularCompilerOptions": {
    "annotateForClosureCompiler": false
  }
}
```

> The following options cannot be changed: `flatModuleId`, `flatModuleOutFile and `skipTemplateCodegen`.

#### Dependency declaration

By default, the **Angular Package Builder** will identify your libraries' dependencies automatically. If, for some reason, a dependency is missing or you want to overwrite a dependency definition, you can declare them as `dependency package name` -> `global constant`.

``` json
{
  "dependencies": {
    "@ngx-translate/core": "ngxTranslate.core"
  }
}
```

<br>

### CLI commands

Usually, simply calling `angular-package-builder` in your npm scripts should work like a charm. There are, however, two parameters which can be defined:

- `--config <PATH>` allows you to define a custom path to your `.angular-package.json` file
- `--debug` emits the output of intermediate build steps to the disk (`dist-angular-package-builder`)

> You can always run `angular-package-builder --help` to get a full list of available command line parameters.

<br><br>

## Known pitfalls w/ solutions

There are quite a few pitfalls one might run into when packaging an Angular library. Many of them are everything but obvious, and the fix is not always clear. The following is a collection of known pitfally and tips on how to solve them.

> Feel free to extend this list by creating an issue / opening a Pull Request!

<br>

### Barrels re-exporting barrels

Normally, libraries make their implementation available from a single import source. Internally, this is achieved by re-exporting (importing and then exporting) implementation using so-called **[Barrels](https://angular.io/guide/glossary#barrel)**, seen in the form of `index.ts` files.

While this works like a charm for the top-level barrel / `index.ts` file, issues will occur when barrels re-export barrels. Funnily enough, when doing so the Angular Package Builder will succeed, and even the compilation output will look like it is correct - but actually is not. When trying to import the corrupt library, Angular applications will throw errors (e.g. dependencies cannot be resolved).

**Tip: Only use a single barrel / `index.ts` file at the top of you library, re-exporting all public functionality.**

<br>

### Forbidden JSDoc tags

When building a library with `annotateForClosureCompiler` being enabled (which it is by default), not all JSDoc annotations are allowed. In particular, annotations which are unnecessary because of the information TypeScript can provide must not be used - otherwhise, the Angular Compiler (tsickle to be specific) will complain. Forbidden tags include:

- types in parameter tags (e.g. `@param {string} myOption - My option`)
- type tags on variables (e.g. `@type {string}`)
- annotations such as `@constructor` or `@class`.

> The full list of alled JSDoc tags can be found **[in the tsickle source files](https://github.com/angular/tsickle/blob/d24b139b71a3f86bf25d6eecf4d4dcdad3b379e4/src/jsdoc.ts#L48)**.

**Tip: Remove all unnecessary JSDoc information until the Angular Compiler is happy**. Alternatively, you could also disabled the `annotateForClosureCompiler` option in the `angularCompilerOptions` - but I don't recommend it :)

<br>

### Metadata validation errors

TODO: Static classes, disable "strictMetadataEmit" ...

<br>

### Issues with 3rd-party libraries

TODO: For instance momentjs, allow synthetic default imports, ...

<br><br>

## Creator

**Dominique Müller**

- E-Mail: **[dominique.m.mueller@gmail.com](mailto:dominique.m.mueller@gmail.com)**
- Website: **[www.devdom.io](https://www.devdom.io/)**
- Twitter: **[@itsdevdom](https://twitter.com/itsdevdom)**
