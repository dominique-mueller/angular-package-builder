const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'test/errors/library-style-scss-invalid/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
