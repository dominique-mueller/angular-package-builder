import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/errors/cirulcar-dependencies-two/library-core/.angular-package.json',
	'test/errors/cirulcar-dependencies-two/library-ui/.angular-package.json',
	'test/errors/cirulcar-dependencies-two/library-tracking/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
