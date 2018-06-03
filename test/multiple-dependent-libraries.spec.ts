import { runAngularPackageBuilder } from '../index';

import { expectES2015 } from './expects/expect-es2015';
import { expectES5 } from './expects/expect-es5';
import { expectUMD } from './expects/expect-umd';
import { expectSourcemap } from './expects/expect-sourcemap';

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

	} );

} );
