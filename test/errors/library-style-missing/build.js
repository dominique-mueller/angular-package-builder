const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

export const build = () => runAngularPackageBuilder( [
	'test/errors/library-style-missing/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
