import { runAngularPackageBuilder } from '../../..';

runAngularPackageBuilder( [
	'test/multiple-dependent-libraries/packages/library-core/.angular-package.json',
	'test/multiple-dependent-libraries/packages/library-ui/.angular-package.json',
	'test/multiple-dependent-libraries/packages/library-tracking/.angular-package.json'
] );
