# Migration Guide

Strictly following semantic versioning means that breaking changes only occur between major versions. This document's purpose is to give a
detailed insights into those changes, and - most importantly - lays out a migration strategy.

Also see the **[CHANGELOG](./CHANGELOG.md)** and
**[GitHub releases](https://github.com/dominique-mueller/angular-package-builder/releases)**.

<br>

## Migration from `1.x` to `2.x`

Version 2 of the **Angular Package Builder** introduces some major new features, such as support for multiple entry points and even multiple
libraries. This inevitably leads to a few (possibly breaking) changes.

> The amount of breaking changes is rather small, thus a migration shouldn't take longer than 5 minutes.

#### Updated command parameters

The parameters of the `angular-package-builder` command have changed slightly. In particular, both the `--config` and `--debug` parameters
do no longer exist, instead the `.angular-package.json` files are to be referenced directly. Therefore, the migration solely consist of
removing both the `--config` and `--debug` parameters. For example:

``` bash
# With 1.x
angular-package-builder --config ./angular-package.json

# With 2.x
angular-package-builder ./angular-package.json
```

#### Automatic copying and update of `package.json` file

First, the `.angular-package.json` file must be placed next to the libraries' `package.json` files. And second, the `package.json`
file will now be updated with the entry point information automatically, and emitted to the output folder.

This means that any entry point information can be safely removed from the `package.json` file. Should the information still exist, it will
be overwritten by the **Angular Package Builder**.

#### Custom typings

The automatic detection and inclusion of custom TypeScript typing files has been removed. Typings coming from the `node_modules` folder are
still taken into account as expected.

#### Angular & TypeScript compatibility

The **Angular Package Builder** is now compatible with every Angular version starting from `4.0.0`. While this is not
necessarily a breaking change, it should be noted that the `peerDependencies` have been updated correspondingly, now requiring

- both the `@angular/compiler` and `@angular/compiler-cli` packages, at least in version `4.0.0`
- and the `typescript` package, at least in version `2.4.0`.

The compatibility between Angular and TypeScript, however, is much more complicated and thus cannot be reflected using `peerDependencies`
only. For a more detailed compatibility matrix, see the
**[README](https://github.com/dominique-mueller/angular-package-builder#requirements)**.

> Don't forget: Angular libraries built using a specific major Angular version are only compatible with applications using the same Angular
> version! Using an Angular 6 library in an Angular 4 project is not possible.
