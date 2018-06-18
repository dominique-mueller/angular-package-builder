const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

export const build: () => runAngularPackageBuilder( [
	'test/external-resources/packages/library-style-css/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
