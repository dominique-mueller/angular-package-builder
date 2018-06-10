import { runAngularPackageBuilder } from '../../index';
import { expectPackage } from '../utilities/expect-package'

/**
 * Unit Test: Multiple Dependent Libraries
 */
describe( 'Multiple Dependent Libraries', () => {

	beforeAll( async () => {

		// Build packages
		await runAngularPackageBuilder( [
			'test/multiple-dependent-libraries/packages/my-library-core/.angular-package.json',
			'test/multiple-dependent-libraries/packages/my-library-ui/.angular-package.json',
			'test/multiple-dependent-libraries/packages/my-library-tracking/.angular-package.json',
		] );

	} );

	expectPackage( {
		packageName: '@my-library/core',
		root: 'test/multiple-dependent-libraries/packages/my-library-core',
		files: [
			{
				path: 'index',
				hasSourcemap: false
			},
			{
				path: 'src/library.module',
				classNames: [
					'MyLibraryCoreModule'
				],
				hasSourcemap: true
			},
			{
				path: 'src/form-control-registry/form-control-registry.service',
				classNames: [
					'MyLibraryFormControlRegistryService'
				],
				hasSourcemap: true
			}
		]
	} );

	expectPackage( {
		packageName: '@my-library/tracking',
		root: 'test/multiple-dependent-libraries/packages/my-library-tracking',
		files: [
			{
				path: 'index',
				hasSourcemap: false
			},
			{
				path: 'src/library.module',
				classNames: [
					'MyLibraryTrackingModule'
				],
				hasSourcemap: true
			},
			{
				path: 'src/tracking/tracking.service',
				classNames: [
					'MyLibraryTrackingService'
				],
				hasSourcemap: true
			}
		]
	} );

	expectPackage( {
		packageName: '@my-library/ui',
		root: 'test/multiple-dependent-libraries/packages/my-library-ui',
		files: [
			{
				path: 'index',
				hasSourcemap: false
			},
			{
				path: 'src/library.module',
				classNames: [
					'MyLibraryUIModule'
				],
				hasSourcemap: true
			},
			{
				path: 'src/input/input.component',
				classNames: [
					'MyLibraryInputComponent'
				],
				hasSourcemap: true
			}
		]
	} );

	expectPackage( {
		packageName: '@my-library/ui/testing',
		root: 'test/multiple-dependent-libraries/packages/my-library-ui',
		rootFolder: 'testing',
		files: [
			{
				path: 'index',
				hasSourcemap: false
			},
			{
				path: 'input/input.test-utility',
				classNames: [
					'MyLibraryInputComponentTestUtility'
				],
				hasSourcemap: true
			}
		]
	} );

} );
