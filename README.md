<div align="center">

# angular-package-builder

**Packages your Angular 4+ library based on the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview).**

[![npm version](https://img.shields.io/npm/v/angular-package-builder.svg?maxAge=3600&style=flat)](https://www.npmjs.com/package/angular-package-builder)
[![dependency status](https://img.shields.io/david/dominique-mueller/angular-package-builder.svg?maxAge=3600&style=flat)](https://david-dm.org/dominique-mueller/angular-package-builder)
[![travis ci build status](https://img.shields.io/travis/dominique-mueller/angular-package-builder/master.svg?maxAge=3600&style=flat)](https://travis-ci.org/dominique-mueller/angular-package-builder)
[![license](https://img.shields.io/npm/l/angular-package-builder.svg?maxAge=3600&style=flat)](https://github.com/dominique-mueller/automatic-release/LICENSE)

</div>

<br><br>

## What it does

These days, setting up build chains for frontend projects requires lots of knowledge and time. When working with Angular, in particular, there is a fair amount of things to do in order to get an Angular library published just right.

The **Angular Package Builder** is here to help! Once set up, this NodeJS-based command line tool will build your Angular libraries with a single command, allowing developers to focus on the important things - developing!

Features include:

- :pushpin: Support for primary and (multiple) secondary entry points
- :gift: Support for multiple libraries (e.g. in a monorepo)
- :page_facing_up: Inlining of external resources, such as templates (HTML) and styles (CSS, SASS)
- :hammer: Custom configurations (Angular compiler options, TypeScipt compiler options, external dependencies)

The result is a package, following the official **[Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview)**:

- :green_book: JavaScript build (ES2015, ES5)
- :orange_book: JavaScript bundles (flat ES2015, flat ES5, UMD)
- :blue_book: TypeScript type definition files
- :closed_book: Angular AoT metadata file
- :notebook_with_decorative_cover: `package.json` file, pointing to entry files

![Angular Package Builder Preview](/docs/preview.gif?raw=true)

<br><br><br>

## How to install

You can get the **angular-package-builder** via **npm** by adding it as a new *devDependency* to your `package.json` file and running
`npm install`. Alternatively, run the following command:

``` bash
npm install angular-package-builder --save-dev
```

<br>

### Angular compatibility

The following lists the Angular versions supported by the **Angular Package Builder**. The table also mentions the TypeScript and RxJS
versions which are officially supported by each Angular version. Diverging from this matrix is surely possible yet might lead to
unexpected issues. The last column defines the minimal required NodeJS version.

| Angular                                 | TypeScript              | RxJS  | NodeJS     |
| --------------------------------------- | ----------------------- | ----- | ---------- |
| `4.0.x` `4.1.x` `4.2.x` `4.3.x` `4.4.x` | `2.1.x` `2.2.x` `2.3.x` | `5.x` | `>= 7.6.0` |
| `5.0.x`                                 | `2.4.x`                 | `5.x` | `>= 7.6.0` |
| `5.1.x`                                 | `2.4.x` `2.5.x`         | `5.x` | `>= 7.6.0` |
| `5.2.x`                                 | `2.4.x` `2.5.x` `2.6.x` | `5.x` | `>= 7.6.0` |
| `6.0.x`                                 | `2.7.x`                 | `6.x` | `>= 8.0.0` |

> Angular 2 is not supported. Angular versions newer than `6.0.x` might work, yet have not not been tested.

<br><br><br>

## How to use

In most cases, integrating **angular-package-builder** into a project is very straightforward.

> The **Angular Package Builder** only builds libraries from an Angular / JavaScript perspective. It's possible that you might have to setup
> a few extra build steps, for instance in order to compile global SASS, or copy assets / other files.

<br>

### Step 1: Create `.angular-package.json` file

Now, every library requires a `.angular-package.json` file to be present, placed directly next to the `package.json` file of that library.
Within that `.angular-package.json` file, you can place the build onfiguration for your library.

A minimal configuration looks like the following:

``` json
{
  "$schema": "./node_modules/angular-package-builder/angular-package.schema.json",
  "entryFile": "./index.ts",
  "outDir": "./dist"
}
```

The two options seen above are also the only required ones:

- `entryFile` is the relative path to the primary entry file
  - Usually, entry files are named `index.ts`
  - All further files of the library must be within the same folder, or some place deeper in the directory
- `outDir` is the relative path to the build output folder
  - Usually, the build output folder is named `dist`
  - Don't forget to add the `outDir` path to your `.gitignore` file

#### Directory structure

The following directory structure is recommended:

``` javascript
── dist/                  // Output
   └── ...
── src/                   // Source
   └── ...
── .angular-package.json  // Build config
── index.ts               // Entry file
── package.json           // Package
```

#### Secondary entry points

Angular, for instance, has packages with multiple entry points: `@angular/core` as the primary, and `@angular/core/testing` as the (here
only) secondary. Within the `.angular-package.json` file, you can define any number of secondary entry points using the `secondaryEntries`
option. For instance:

``` json
{
  "$schema": "./node_modules/angular-package-builder/angular-package.schema.json",
  "entryFile": "./index.ts",
  "outDir": "./dist",
  "secondaryEntries": [
    {
      "entryFile": "./testing/index.ts"
    }
  ]
}
```

<br>

### Step 2: Add build script to `package.json`

Now, run **angular-package-builder** within one of your `package.json` scripts. The command accepts an unordered list of paths to
`.angular-package.json` files as parameters. For instance:

``` json
{
  "scripts": {
    "build": "angular-package-builder ./my-library/.angular-package.json"
  }
}
```

#### Multiple libraries

Angular, again, consists of multiple packages, all united in a single Git repository (called monorepo). The **Angular Package Builder** is
able to build multiple libraries using a single command. Building more libraries means adding more `.angular-package.json` files to the
corresponding npm script. For example:

``` json
{
  "scripts": {
    "build": "angular-package-builder ./lib-one/.angular-package.json ./lib-two/.angular-package.json"
  }
}
```

> The order of the parameters does not matter as the **Angular Package Builder** will derive the build order independently.

<br><br><br>

## Advanced configuration

Usually, configuring the `entryFile` and `outDir` should be sufficient for most libraries. For more advanced use cases or requirements, you
can extend the build configuration in your `.angular-package.json` file(s).

<br>

### TypeScript compiler options

One of the things you might want to configure specifically for your project is TypeScript. Popular options include `strictNullChecks`,
`skipLibCheck` and `allowSyntheticDefaultImports`. For instance:

``` json
{
  "typescriptCompilerOptions": {
    "strictNullChecks": true
  }
}
```

See the **[TypeScript Compiler Options Documentation](https://www.typescriptlang.org/docs/handbook/compiler-options.html)** for the full
list of available options.

> The following options cannot be changed:<br>
> `declaration`, `emitDecoratorMetadata`, `experimentalDecorators`, `module`, `moduleResolution`, `newLine`, `outDir`, `rootDir`,
> `sourceRoot` and `target`

<br>

### Angular compiler options

Furthermore, you might also decide to configure the Angular compiler differently. Common options are `annotateForClosureCompiler`,
`preserveWhitespaces` and `strictMetadataEmit`. For instance:

``` json
{
  "angularCompilerOptions": {
    "annotateForClosureCompiler": false
  }
}
```

> The following options cannot be changed:<br>
> `flatModuleId`, `flatModuleOutFile` and `skipTemplateCodegen`

<br>

### Dependencies

By default, the **Angular Package Builder** will identify your libraries' dependencies automatically. If, for some reason, a dependency is
missing or you want to overwrite a dependency definition, you can declare them in the form of `package -> global constant`. For instance:

``` json
{
  "dependencies": {
    "@ngx-translate/core": "ngxTranslate.core"
  }
}
```

<br><br><br>

## Known pitfalls with solutions

There are quite a few pitfalls when packaging an Angular library. Most of them are all but obvious, and the fix is not always clear. The following is a collection of known pitfally, plus tips on how to solve them.

> Feel free to extend this list by **[creating an issue](https://github.com/dominique-mueller/angular-package-builder/issues/new)**!

<br>

### Caution with barrels

Usually, libraries are built in a way which allows them to be imported by a single import source (normalle the name of the module / package). This can be achieved by re-exporting the implementation (spread accross multiple files) with a so-called **[Barrel](https://angular.io/guide/glossary#barrel)**, in other word an `index.ts` file.

While this very common technique works like a charm for the top barrel, *issues might occur when - somewhere within the library - two barrels meet each other*. Funnily enough, should such a constellation lead to any issues, it won't be appeatant right away; chances are good that the Angular Package Builder will succeed, and the compilation output will probably look correct. However, when trying to import the library into an Angular application later on,an error will be thrown (e.g. "injected dependencies cannot be resolved").

#### Solution

We recommend to only use a single barrel / `index.ts` file at the root of you library, re-exporting all public functionality from that place.

<br>

### Forbidden JSDoc tags

The usage of type-related JSDoc tags / information within JSdoc tags is disallowed, reason being that the TypeScript syntax already exposes
this kind of information. Forbidden are (amongst other things):

- type information in parameter tags (e.g. `@param {string} myOption`)
- type-related tags on variables, functions, classes (e.g. `@type`, `@constructor`, `@function`, `@class`)
- tags regarding visibility (e.g. `@private`, `@public`)
- further redundant tags such as `@static`, `@extends`, `@implements`

> The full list of allowed / disallowed JSDoc tags can be found
**[in the tsickle source](https://github.com/angular/tsickle/blob/d24b139b71a3f86bf25d6eecf4d4dcdad3b379e4/src/jsdoc.ts#L48)**.

If any of those tags are being used anyway, the Angular Compiler (`tsickle` to be specific) will complain:

![Angular Package Builder - forbidden JSdoc error](/docs/error-jsdoc.png?raw=true)

#### Solution

Preferably, remove all redundant JSDoc tags until the Angular Compiler is happy. As an alternative, one could also set the
`annotateForClosureCompiler` option in the `angularCompilerOptions` to `false` - but it's not recommended.

<br>

### Angular metadata generation errors

Especially when writing custom factories for `NgModules`, one might run into Angular metadata generation issues, usually resulting in errors
like `Lambda not supported` or `Reference to a non-exported function`.

![Angular Package Builder - metadata generation error](/docs/error-lambda.png?raw=true)

#### Solution

This issue can be solved by extracing the mentioned arrow function into a separate function, and making sure that it's exported.

> Also see **[this Angular issue on GitHub](https://github.com/angular/angular/issues/11262)**.

<br>

### Angular metadata validation errors

Rarely, and only when using arrow functions within static classes and / or methods, an error like `Function call not supported` might occur.

#### Solution

This issue can be solved in two ways:

- Prefered: Add the `@dynamic`JSdoc tag to the comment describing the static method (or, if this should not work, the class containing the
  static method). Then, the Angular Compiler will make an exception for this piece of code when validating the generated metadata.
- Alternative: Set the `strictMetadataEmit` option in the `angularCompilerOptions` object to `false`. Then, however, other metadata
  validation issues will no longer be visible.

> Also see **[this Angular issue on GitHub](https://github.com/angular/angular/issues/19698)**.

<br>

### Synthetic imports

Often, we integrate long-existing libraries into our Angular projects. **[Moment.js](https://momentjs.com/)**, for example, is one of the
libraries often used when working with dates. Due to its age, it's published as a single-entry ES5 module - which means people usually write
the following TypeScript code to import Moment.js into a file:

``` typescript
import * as moment from 'moment';
```

When trying to package an Angular library using the import statement above, an error will be thrown. In particular:

``` text
ERROR: Error: Cannot call a namespace ('moment')
```

#### Solution

The solution to this problem is called **[synthetic default imports](https://www.typescriptlang.org/docs/handbook/compiler-options.html)**,
a technique which does allow TypeScript to make default import from modules that come without a default export.

First, enable synthetic default import support in the TypeScript configuration by adding the following line to the
`typescriptCompilerOptions` within your `.angular-package.json` file:

``` json
"typescriptCompilerOptions": {
  "allowSyntheticDefaultImports": true
}
```

Then, change the affected import statements to default import statements. For instance:

``` typescript
import moment from 'moment';
```

<br><br><br>

## Creator

**Dominique Müller**

- E-Mail: **[dominique.m.mueller@gmail.com](mailto:dominique.m.mueller@gmail.com)**
- Website: **[www.devdom.io](https://www.devdom.io/)**
- Twitter: **[@itsdevdom](https://twitter.com/itsdevdom)**
