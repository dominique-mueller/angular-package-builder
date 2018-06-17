import { runAngularPackageBuilder } from 'angular-package-builder';

import { expectPackage } from '../utilities/expect-package';

/**
 * Unit Test: Multiple Dependent Libraries
 */
describe( 'Multiple Dependent Libraries', () => {

	beforeAll( async () => {

		// Build packages
		await runAngularPackageBuilder( [
			'test/multiple-libraries/packages/library-core/.angular-package.json',
			'test/multiple-libraries/packages/library-ui/.angular-package.json',
			'test/multiple-libraries/packages/library-tracking/.angular-package.json'
		] );

	} );

	expectPackage( {
		packageName: '@library/core',
		root: 'test/multiple-libraries/packages/library-core',
		files: [
			{
				path: 'index',
				hasSourcemap: false
			},
			{
				path: 'src/library.module',
				classNames: [
					'LibraryCoreModule'
				],
				hasSourcemap: true
			},
			{
				path: 'src/form-control-registry/form-control-registry.service',
				classNames: [
					'LibraryFormControlRegistryService'
				],
				hasSourcemap: true
			}
		]
	} );

	expectPackage( {
		packageName: '@library/tracking',
		root: 'test/multiple-libraries/packages/library-tracking',
		files: [
			{
				path: 'index',
				hasSourcemap: false
			},
			{
				path: 'src/library.module',
				classNames: [
					'LibraryTrackingModule'
				],
				hasSourcemap: true
			},
			{
				path: 'src/tracking/tracking.service',
				classNames: [
					'LibraryTrackingService'
				],
				hasSourcemap: true
			}
		]
	} );

	expectPackage( {
		packageName: '@library/ui',
		root: 'test/multiple-libraries/packages/library-ui',
		files: [
			{
				path: 'index',
				hasSourcemap: false
			},
			{
				path: 'src/library.module',
				classNames: [
					'LibraryUIModule'
				],
				hasSourcemap: true
			},
			{
				path: 'src/input/input.component',
				classNames: [
					'LibraryInputComponent'
				],
				hasSourcemap: true
			}
		]
	} );

	expectPackage( {
		packageName: '@library/ui/testing',
		root: 'test/multiple-libraries/packages/library-ui',
		rootFolder: 'testing',
		files: [
			{
				path: 'index',
				hasSourcemap: false
			},
			{
				path: 'input/input.test-utility',
				classNames: [
					'LibraryInputComponentTestUtility'
				],
				hasSourcemap: true
			}
		]
	} );

} );
