const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'test/external-resources/packages/library-style-scss-empty/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
