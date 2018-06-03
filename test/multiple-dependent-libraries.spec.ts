import { runAngularPackageBuilder } from '../index';

describe( 'Multiple dependent libraries', () => {

	beforeAll( async () => {

		// Build packages
		await runAngularPackageBuilder( [
			'test/multiple-dependent-libraries/my-library-core/.angular-package.json',
			'test/multiple-dependent-libraries/my-library-ui/.angular-package.json',
			'test/multiple-dependent-libraries/my-library-tracking/.angular-package.json',
		] );

	} );

	it( 'should run', () => {
		expect( true ).toBe( true );
	} );

} );
