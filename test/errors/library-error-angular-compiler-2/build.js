const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

export const build: () => runAngularPackageBuilder( [
	'test/errors/library-error-angular-compiler-2/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
