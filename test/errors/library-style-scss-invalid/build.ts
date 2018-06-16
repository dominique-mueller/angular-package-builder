import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-style-scss-invalid/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
