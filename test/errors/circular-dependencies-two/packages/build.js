const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

runAngularPackageBuilder( [
	'test/errors/circular-dependencies-two/packages/library-tracking/.angular-package.json',
	'test/errors/circular-dependencies-two/packages/library-ui/.angular-package.json',
	'test/errors/circular-dependencies-two/packages/library-core/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
