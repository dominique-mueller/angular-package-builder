const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'./library-tracking/.angular-package.json',
	'./library-ui/.angular-package.json',
	'./library-core/.angular-package.json',
] ).catch( ( error ) => {
	// Do nothing
} );