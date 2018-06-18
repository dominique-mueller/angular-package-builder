const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

export const build: () => runAngularPackageBuilder( [
	'test/errors/inner-circular-dependencies-two/packages/library-tracking/.angular-package.json',
	'test/errors/inner-circular-dependencies-two/packages/library-ui/.angular-package.json',
	'test/errors/inner-circular-dependencies-two/packages/library-core/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
