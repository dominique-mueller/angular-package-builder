import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/errors/library-style-css-invalid/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
