const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'test/errors/library-style-unsupported/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
