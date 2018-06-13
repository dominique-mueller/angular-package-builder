import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/errors/packages/library-style-css-invalid/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
