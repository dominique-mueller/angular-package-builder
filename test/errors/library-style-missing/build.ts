import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-style-missing/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
