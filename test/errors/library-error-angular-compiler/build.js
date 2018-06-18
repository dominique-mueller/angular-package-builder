const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

export const build = () => runAngularPackageBuilder( [
	'test/errors/library-error-angular-compiler/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
