import { runAngularPackageBuilder } from '../../index';

/**
 * Unit Test: Errors
 */
describe( 'Errors', () => {

	it( 'should throw an error when compilation fails, due to a TypeScript error', async () => {

		let angularPackageBuilderError: Error | null = null;
		try {
			await runAngularPackageBuilder( [
				'test/errors/packages/library-error-typescript/.angular-package.json'
			] );
		} catch ( error ) {
			angularPackageBuilderError = error;
		}

		expect( angularPackageBuilderError ).not.toBeNull();

	} );

	it( 'should throw an error when compilation fails, due to a tsickle error', async () => {

		let angularPackageBuilderError: Error | null = null;
		try {
			await runAngularPackageBuilder( [
				'test/errors/packages/library-error-tsickle/.angular-package.json'
			] );
		} catch ( error ) {
			angularPackageBuilderError = error;
		}

		expect( angularPackageBuilderError ).not.toBeNull();

	} );

	it( 'should throw an error when compilation fails, due to an Angular Compiler error (1)', async () => {

		let angularPackageBuilderError: Error | null = null;
		try {
			await runAngularPackageBuilder( [
				'test/errors/packages/library-error-angular-compiler/.angular-package.json'
			] );
		} catch ( error ) {
			angularPackageBuilderError = error;
		}

		expect( angularPackageBuilderError ).not.toBeNull();

	} );

	it( 'should throw an error when compilation fails, due to an Angular Compiler error (2)', async () => {

		let angularPackageBuilderError: Error | null = null;
		try {
			await runAngularPackageBuilder( [
				'test/errors/packages/library-error-angular-compiler/.angular-package.json'
			] );
		} catch ( error ) {
			angularPackageBuilderError = error;
		}

		expect( angularPackageBuilderError ).not.toBeNull();

	} );

} );
