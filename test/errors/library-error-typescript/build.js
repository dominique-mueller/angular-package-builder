const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'test/errors/library-error-typescript/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
