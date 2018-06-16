import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/packages/library-style-missing/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
