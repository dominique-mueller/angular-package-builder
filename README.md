<div align="center">

# angular-package-builder

**Packages your Angular libraries based on the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview).** *Works with Angular 5+.*

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

Under the hood, **angular-package-builder** will:

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

Finally, reference your build output by adding the following to your `package.json` (changing file names and paths based on your project and its configuration):

``` json
{
  "typings": "./my-library.d.ts",
  "main": "./bundles/my-library.umd.js",
  "module": "./esm5/my-library.js",
  "es2015": "./esm2015/my-library.js","
}
```

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

#### dependency declaration

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

<br><br>

## Known pitfalls w/ solutions

TODO: Description, open issue with own ones

### Barrels referencing barrels

Normally, libraries allow their implementation to be imported from a single import source. Internally, this can be achieved by re-exporting (import and exporting) implementation using so-called **[Barrels](https://angular.io/guide/glossary#barrel)**, seen in the form of `index.ts` files.

While this works like a charm for the top-level barrel / `index.ts` file, Issues will occur when barrels import barrels. When doing so, the Angular Package Builder will succeed, and the compilation output will look like it is correct - but actually is not. When trying to import the corrupt library build, Angular applications will throw errors (telling you that some dependencies cannot be resolved).

**Solution: Only use a single barrel / `index.ts` file at the top of you library, re-exporting all public functionality in a single place**.

<br>

### Disable strictmetadataemit

TODO: ...

<br>

### JSdoc comments

TODO: Solution, closure compiler annotations

<br>

### Weird deps

TODO: momentjs, allow synthetic

<br><br>

## Creator

**Dominique Müller**

- E-Mail: **[dominique.m.mueller@gmail.com](mailto:dominique.m.mueller@gmail.com)**
- Website: **[www.devdom.io](https://www.devdom.io/)**
- Twitter: **[@itsdevdom](https://twitter.com/itsdevdom)**
