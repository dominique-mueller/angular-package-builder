const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

export const build = () => runAngularPackageBuilder( [
	'test/errors/library-error-config-invalid/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
