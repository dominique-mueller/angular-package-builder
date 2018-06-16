import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/errors/circular-dependencies-two/packages/library-core/.angular-package.json',
	'test/errors/circular-dependencies-two/packages/library-ui/.angular-package.json',
	'test/errors/circular-dependencies-two/packages/library-tracking/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
