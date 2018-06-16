import { runAngularPackageBuilder } from '../../index';

/**
 * Unit Test: Error & Warning Handling
 */
describe( 'Error & Warning Handling', () => {

	describe( 'Circular Dependency Errors', () => {

		it( 'should throw an error when two dependencies create a circular dependency', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/circular-dependencies-two/packages/library-core/.angular-package.json',
					'test/errors/circular-dependencies-two/packages/library-tracking/.angular-package.json',
					'test/errors/circular-dependencies-two/packages/library-ui/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).toBeNull();

		} );

		it( 'should throw an error when three dependencies create a circular dependency', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/circular-dependencies-three/packages/library-core/.angular-package.json',
					'test/errors/circular-dependencies-three/packages/library-tracking/.angular-package.json',
					'test/errors/circular-dependencies-three/packages/library-ui/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).toBeNull();

		} );

	} );

	describe( 'Errors', () => {

		it( 'should throw an error when the external HTML template file does not exist', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-template-missing/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

		it( 'should throw an error when transforming an invalid external HTML template', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-template-html-invalid/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

		it( 'should throw an error when referencing an external template of an unsupported file type', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-template-unsupported/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

		it( 'should throw an error when the external style file does not exist', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-style-missing/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

		it( 'should throw an error when transforming an invalid external CSS style', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-style-css-invalid/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

		it( 'should throw an error when transforming an invalid external SASS style', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-style-scss-invalid/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

		it( 'should throw an error when referencing an external style of an unsupported file type', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-style-unsupported/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

		it( 'should throw an error when a TypeScript error occurs', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-error-typescript/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

		it( 'should throw an error when a tsickle error occurs', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-error-tsickle/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

		it( 'should throw an error when an Angular Compiler error occurs (1)', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-error-angular-compiler/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

		it( 'should throw an error when an Angular Compiler error occurs (2)', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-error-angular-compiler/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

		it( 'should throw an error when a Rollup error occurs', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-template-rollup/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).not.toBeNull();

		} );

	} );

	describe( 'Warnings', () => {

		it( 'should run through successfully when a Rollup warning gets emitted', async () => {

			let angularPackageBuilderError: Error | null = null;
			try {
				await runAngularPackageBuilder( [
					'test/errors/library-warning-rollup/.angular-package.json'
				] );
			} catch ( error ) {
				angularPackageBuilderError = error;
			}

			expect( angularPackageBuilderError ).toBeNull();

		} );

	} );

} );
