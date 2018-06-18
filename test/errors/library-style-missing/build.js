const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'test/errors/library-style-missing/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
