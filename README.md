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

<br><br><br>

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

<br><br><br>

## How to use

In most cases, integrating **angular-package-builder** into a project is very straightforward.

> The **Angular Package Builder** only builds libraries from an Angular / JavaScript perspective. It's possible that you might have to setup a few extra build steps, for instance in order to compile global SASS, or copy assets / other files.

<br>

### Step 1: Add `package.json` script

First, make sure to run **angular-package-builder** within one of your `package.json` scripts. For instance:

``` json
{
  "scripts": {
    "build": "angular-package-builder"
  }
}
```

In addition, there are two (optional and usually not needed) parameters which can be defined:

- `--config <PATH>` allows you to define a custom path to your `.angular-package.json` file
- `--debug` emits the output of intermediate build steps to the disk (`dist-angular-package-builder`)

> You can always run `angular-package-builder --help` to get a full list of available command line parameters.

<br>

### Step 2: Create `.angular-package.json` file

Then, create a `.angular-package.json` file in your project's root folder, and fill it with your configuration. For instance:

``` json
{
  "$schema": "node_modules/angular-package-builder/angular-package.schema.json",
  "entryFile": "lib/src/index.ts",
  "outDir": "dist"
}
```

The two options seen above are always required. In particular:

- `entryFile` is the relative path to the entry file (usually an `index.ts`) file
  - Note: In order to follow the Angular Package Format strictly, the entry file must be in a folder named `src`
  - Note: Other files which are part of your library must be at the same directory level, or deeper
- `outDir` is the relative path to the build output directory
  - Note: Don't forget to add the path to your `.gitignore` file

<br>

### Step 3: Define `package.json` entry points

Finally, reference your build output by adding the following fields to your `package.json`, changing file names and paths based on your project configuration:

``` json
{
  "typings": "./[package-name].d.ts",
  "main": "./bundles/[package-name].umd.js",
  "module": "./esm5/[package-name].js",
  "es2015": "./esm2015/[package-name].js","
}
```

<br><br><br>

## Advanced configuration

Usually, the configuration described above should be working for most library projects. For special use cases, or more advanced configuration, you can extend your `.angular-package.json` file further.

<br>

### TypeScript compiler options

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

<br>

### Angular compiler options

Furthermore, you might also decide to configure the Angular compiler. Common options are `annotateForClosureCompiler`, `preserveWhitespaces` and `strictMetadataEmit`.

``` json
{
  "angularCompilerOptions": {
    "annotateForClosureCompiler": false
  }
}
```

> The following options cannot be changed: `flatModuleId`, `flatModuleOutFile and `skipTemplateCodegen`.

<br>

### Dependency declaration

By default, the **Angular Package Builder** will identify your libraries' dependencies automatically. If, for some reason, a dependency is missing or you want to overwrite a dependency definition, you can declare them as `dependency package name` -> `global constant`.

``` json
{
  "dependencies": {
    "@ngx-translate/core": "ngxTranslate.core"
  }
}
```

<br><br><br>

## Known pitfalls with solutions

There are quite a few pitfalls one can run into when packaging an Angular library. Most of them are all but obvious, and the fix is not always clear. The following is a collection of known pitfally, plus tips on how to solve them.

> Feel free to extend this list by **[creating an issue](https://github.com/dominique-mueller/angular-package-builder/issues/new)**!

<br>

### Caution with barrels

Usually, libraries are built in a way which allows them to be imported by a single import source (normalle the name of the module / package). This can be achieved by re-exporting the implementation (spread accross multiple files) with a so-called **[Barrel](https://angular.io/guide/glossary#barrel)**, in other word an `index.ts` file.

While this very common technique works like a charm for the top barrel, *issues might occur when - somewhere within the library - two barrels meet each other*. Funnily enough, should such a constellation lead to any issues, it won't be appeatant right away; chances are good that the Angular Package Builder will succeed, and the compilation output will probably look correct. However, when trying to import the library into an Angular application later on,an error will be thrown (e.g. "injected dependencies cannot be resolved").

#### Solution

We recommend to only use a single barrel / `index.ts` file at the root of you library, re-exporting all public functionality from that place.

<br>

### Forbidden JSDoc tags

When building a library with the `annotateForClosureCompiler` option enabled - which it is by default - not all JSDoc tags are allowed. In particular, any tag which describes the type of classes, methods or variables is not allowed because redundant (the TypeScript code already contains this kind of information). If any of those tags are being used anyway, the Angular Compiler (`tsickle` to be specific) will complain. The list of forbidden tags include:

- types in parameters (e.g. `@param {string} myOption`)
- type tags on variables (e.g. `@type {string}`)
- class or function tags such as `@constructor` or `@class`.

> The full list of allowed JSDoc tags can be found **[in the tsickle source](https://github.com/angular/tsickle/blob/d24b139b71a3f86bf25d6eecf4d4dcdad3b379e4/src/jsdoc.ts#L48)**.

``` text
ERROR: An error occured while trying to compile the TypeScript sources using the Angular Compiler.
       [tsickle] XXX: warning TS0: the type annotation on @param is redundant with its TypeScript type,
                 remove the {...} part
```

#### Solution

Preferably, remove all redundant JSDoc tags until the Angular Compiler is happy. As an alternative, you could also set the `annotateForClosureCompiler` option in the `angularCompilerOptions` to `false` - but we don't recommend it.

> For bigger libraries, removing those JSDoc tags manually is quite a paint and might actually take a very long time. We recommend an IDE or code editor with a search-and-replace functionality that can work with regular expressions to speed up this process (e.g. **[Visual Studio Code](https://code.visualstudio.com/)**).

<br>

### Metadata validation errors

If your library contains custom validators or utilities, you might run into an issue where - at compilation time - the `Angular Compiler CLI` throws an error while validating the generated `metadata.json` file. In particular, the error occurs when using closures (e.g. arrow functions) within static class methods.

``` text
ERROR: An error occured while trying to compile the TypeScript sources using the Angular Compiler.
       [TypeScript]: Error: XXX Error encountered in metadata generated for exported symbol XXX
       [TypeScript] XXX Metadata collected contains an error that will be reported at runtime: Function
                    calls are not supported. Consider replacing the function or lambda with a reference
                    to an exported function.
       [TypeScript] {"__symbolic":"error","message":"Function call not supported","line":XX,"character":XX}
```

#### Solution

There are two ways to solve this issue:

- The preferred solution is to add the `@dynamic` tag to the comment describing the static method (or, if this should not work, the class containing the static method). Then, the Angular Compiler will make an exception for this code.
- The alternative way is to set the `strictMetadataEmit` option in the `angularCompilerOptions` object to `false`. Then, however, other metadata validation issues will no longer be visible.

> For more information on this issue and its solutions, see **[this Angular GitHub issue](https://github.com/angular/angular/issues/19698)**.

<br><br><br>

## Creator

**Dominique Müller**

- E-Mail: **[dominique.m.mueller@gmail.com](mailto:dominique.m.mueller@gmail.com)**
- Website: **[www.devdom.io](https://www.devdom.io/)**
- Twitter: **[@itsdevdom](https://twitter.com/itsdevdom)**
