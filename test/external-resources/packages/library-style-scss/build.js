const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

export const build: () => runAngularPackageBuilder( [
	'test/external-resources/packages/library-style-scss/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
