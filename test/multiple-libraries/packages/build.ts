import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/multiple-libraries/packages/library-core/.angular-package.json',
	'test/multiple-libraries/packages/library-ui/.angular-package.json',
	'test/multiple-libraries/packages/library-tracking/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
