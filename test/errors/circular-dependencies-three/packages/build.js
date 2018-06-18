const runAngularPackageBuilder = require( 'angular-package-builder' ).runAngularPackageBuilder;

export const build = () => runAngularPackageBuilder( [
	'test/errors/circular-dependencies-three/packages/library-tracking/.angular-package.json',
	'test/errors/circular-dependencies-three/packages/library-ui/.angular-package.json',
	'test/errors/circular-dependencies-three/packages/library-core/.angular-package.json'
] ).catch( ( error ) => {
	// Do nothing
} );
