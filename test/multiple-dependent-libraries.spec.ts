import { runAngularPackageBuilder } from '../index';

import { expectES2015 } from './expects/expect-es2015';
import { expectES5 } from './expects/expect-es5';
import { expectUMD } from './expects/expect-umd';
import { expectSourcemap } from './expects/expect-sourcemap';
import { expectMetadata } from './expects/expect-metadata';

describe( 'Multiple dependent libraries', () => {

	beforeAll( async () => {

		// Build packages
		// await runAngularPackageBuilder( [
		// 	'test/multiple-dependent-libraries/my-library-core/.angular-package.json',
		// 	'test/multiple-dependent-libraries/my-library-ui/.angular-package.json',
		// 	'test/multiple-dependent-libraries/my-library-tracking/.angular-package.json',
		// ] );

	} );

	describe( 'Package: @my-library/core', () => {

		describe( 'Output: ES2015 build', () => {
			describe( '(core.js)', () => {
				expectES2015( 'test/multiple-dependent-libraries/my-library-core/dist/esm2015/core.js' );
			} );
			describe( '(index.js)', () => {
				expectES2015( 'test/multiple-dependent-libraries/my-library-core/dist/esm2015/index.js' );
			} );
			describe( '(src/library.module.js)', () => {
				expectES2015( 'test/multiple-dependent-libraries/my-library-core/dist/esm2015/src/library.module.js', {
					classNames: [
						'MyLibraryCoreModule'
					]
				} );
			} );
			describe( '(src/form-control-registry/form-control-registry.service.js)', () => {
				expectES2015( 'test/multiple-dependent-libraries/my-library-core/dist/esm2015/src/form-control-registry/form-control-registry.service.js', {
					classNames: [
						'UIFormControlRegistryService'
					]
				} );
			} );
		} );

		describe( 'Output: FESM2015 bundle', () => {
			expectES2015( 'test/multiple-dependent-libraries/my-library-core/dist/fesm2015/core.js', {
				classNames: [
					'MyLibraryCoreModule',
					'UIFormControlRegistryService'
				]
			} );
		} );

		describe( 'Output: SourceMaps for FESM2015 bundle', () => {
			expectSourcemap( 'test/multiple-dependent-libraries/my-library-core/dist/fesm2015/core.js.map', {
				numberOfSourceFiles: 2
			} );
		} );

		describe( 'Output: ES5 build', () => {
			describe( '(core.js)', () => {
				expectES5( 'test/multiple-dependent-libraries/my-library-core/dist/esm5/core.js' );
			} );
			describe( '(index.js)', () => {
				expectES5( 'test/multiple-dependent-libraries/my-library-core/dist/esm5/index.js' );
			} );
			describe( '(src/library.module.js)', () => {
				expectES5( 'test/multiple-dependent-libraries/my-library-core/dist/esm5/src/library.module.js', {
					classNames: [
						'MyLibraryCoreModule'
					]
				} );
			} );
			describe( '(src/form-control-registry/form-control-registry.service.js)', () => {
				expectES5( 'test/multiple-dependent-libraries/my-library-core/dist/esm5/src/form-control-registry/form-control-registry.service.js', {
					classNames: [
						'UIFormControlRegistryService'
					]
				} );
			} );
		} );

		describe( 'Output: FESM5 bundle', () => {
			expectES5( 'test/multiple-dependent-libraries/my-library-core/dist/fesm5/core.js', {
				classNames: [
					'MyLibraryCoreModule',
					'UIFormControlRegistryService'
				]
			} );
		} );

		describe( 'Output: SourceMaps for FESM5 bundle', () => {
			expectSourcemap( 'test/multiple-dependent-libraries/my-library-core/dist/fesm5/core.js.map', {
				numberOfSourceFiles: 2
			} );
		} );

		describe( 'Output: UMD bundle', () => {
			expectUMD( 'test/multiple-dependent-libraries/my-library-core/dist/bundles/core.umd.js', {
				classNames: [
					'MyLibraryCoreModule',
					'UIFormControlRegistryService'
				]
			} );
		} );

		describe( 'Output: SourceMaps for UMD bundle', () => {
			expectSourcemap( 'test/multiple-dependent-libraries/my-library-core/dist/bundles/core.umd.js.map', {
				numberOfSourceFiles: 2
			} );
		} );

		describe( 'Output: Metadata', () => {
			expectMetadata( 'test/multiple-dependent-libraries/my-library-core/dist/core.metadata.json', {
				packageName: '@my-library/core',
				classNames: [
					'MyLibraryCoreModule',
					'UIFormControlRegistryService'
				]
			} );
		} );

		// TODO: Typings
		// TODO: Package JSON

	} );

} );
