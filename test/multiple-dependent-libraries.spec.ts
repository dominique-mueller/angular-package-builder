import { runAngularPackageBuilder } from '../index';
import { expectPackage } from './utilities/expect-package'

// TODO: Uncomment the following & extract from here!
// beforeAll( async () => {

// Build packages
// await runAngularPackageBuilder( [
// 	'test/multiple-dependent-libraries/my-library-core/.angular-package.json',
// 	'test/multiple-dependent-libraries/my-library-ui/.angular-package.json',
// 	'test/multiple-dependent-libraries/my-library-tracking/.angular-package.json',
// ] );

// } );

expectPackage( {
	packageName: '@my-library/core',
	root: 'test/multiple-dependent-libraries/my-library-core',
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
				'UIFormControlRegistryService'
			],
			hasSourcemap: true
		}
	]
} );
