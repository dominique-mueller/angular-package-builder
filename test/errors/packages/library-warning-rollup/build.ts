import { runAngularPackageBuilder } from '../../../..';

runAngularPackageBuilder( [
	'test/warnings/packages/library-warning-rollup/.angular-package.json'
] ).catch( ( error: Error ) => {
	// Do nothing
} );
