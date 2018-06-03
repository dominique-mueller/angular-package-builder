import * as fs from 'fs';

import { runAngularPackageBuilder } from '../index';

import { JavascriptES2015File } from './utilities/es2015-file';
import { JavascriptES5File } from './utilities/es5-file';
import { JavascriptUMDFile } from './utilities/umd-file';
import { SourcemapFile } from './utilities/sourcemap-file';
import { simplifyFileContent } from './utilities/simplify-file-content';

describe( 'Multiple dependent libraries', () => {

	beforeAll( async () => {

		// Build packages
		// await runAngularPackageBuilder( [
		// 	'test/multiple-dependent-libraries/my-library-core/.angular-package.json',
		// 	'test/multiple-dependent-libraries/my-library-ui/.angular-package.json',
		// 	'test/multiple-dependent-libraries/my-library-tracking/.angular-package.json',
		// ] );

	} );

	describe( 'Package: @my-library/core', () => {

		describe( 'Output: FESM2015 bundle', () => {

			let file: JavascriptES2015File;

			it( 'should exist', () => {
				file = new JavascriptES2015File( 'test/multiple-dependent-libraries/my-library-core/dist/fesm2015/core.js' );
			} );

			it( 'should not be empty', () => {
				expect( file.isEmpty() ).toBe( false );
			} );

			it( 'should be of ES2015 language level', () => {
				expect( file.isES2015LanguageLevel() ).toBe( true );
			} );

			it( 'should be of ES module format', () => {
				expect( file.isESModule() ).toBe( true );
			} );

			it( 'should contain the classes', () => {
				expect( file.hasClass( 'MyLibraryCoreModule' ) ).toBe( true );
				expect( file.hasClass( 'UIFormControlRegistryService' ) ).toBe( true );
			} );

		} );

		describe( 'Output: SourceMaps for FESM2015 bundle', () => {

			let file: SourcemapFile;

			it( 'should exist', () => {
				file = new SourcemapFile( 'test/multiple-dependent-libraries/my-library-core/dist/fesm2015/core.js.map' );
			} );

			it( 'should not be empty', () => {
				expect( file.isEmpty() ).toBe( false );
			} );

			it( 'should reference the bundle file', () => {
				expect( file.getFileName() ).toBe( 'core.js' );
			} );

			it( 'should reference all the source files', () => {
				expect( file.getSources() ).toEqual( {
					'src/library.module.ts': simplifyFileContent(
						fs.readFileSync( 'test/multiple-dependent-libraries/my-library-core/src/library.module.ts', 'utf-8' )
					),
					'src/form-control-registry/form-control-registry.service.ts': simplifyFileContent(
						fs.readFileSync( 'test/multiple-dependent-libraries/my-library-core/src/form-control-registry/form-control-registry.service.ts', 'utf-8' )
					),
				} );
			} );

		} );

		describe( 'Output: FESM5 bundle', () => {

			let file: JavascriptES5File;

			it( 'should exist', () => {
				file = new JavascriptES5File( 'test/multiple-dependent-libraries/my-library-core/dist/fesm5/core.js' );
			} );

			it( 'should not be empty', () => {
				expect( file.isEmpty() ).toBe( false );
			} );

			it( 'should be of ES2015 language level', () => {
				expect( file.isES5LanguageLevel() ).toBe( true );
			} );

			it( 'should be of ES module format', () => {
				expect( file.isESModule() ).toBe( true );
			} );

			it( 'should contain the classes', () => {
				expect( file.hasClass( 'MyLibraryCoreModule' ) ).toBe( true );
				expect( file.hasClass( 'UIFormControlRegistryService' ) ).toBe( true );
			} );

		} );

		describe( 'Output: SourceMaps for FESM5 bundle', () => {

			let file: SourcemapFile;

			it( 'should exist', () => {
				file = new SourcemapFile( 'test/multiple-dependent-libraries/my-library-core/dist/fesm5/core.js.map' );
			} );

			it( 'should not be empty', () => {
				expect( file.isEmpty() ).toBe( false );
			} );

			it( 'should reference the bundle file', () => {
				expect( file.getFileName() ).toBe( 'core.js' );
			} );

			it( 'should reference all the source files', () => {
				expect( file.getSources() ).toEqual( {
					'src/library.module.ts': simplifyFileContent(
						fs.readFileSync( 'test/multiple-dependent-libraries/my-library-core/src/library.module.ts', 'utf-8' )
					),
					'src/form-control-registry/form-control-registry.service.ts': simplifyFileContent(
						fs.readFileSync( 'test/multiple-dependent-libraries/my-library-core/src/form-control-registry/form-control-registry.service.ts', 'utf-8' )
					),
				} );
			} );

		} );

		describe( 'Output: UMD bundle', () => {

			let file: JavascriptUMDFile;

			it( 'should exist', () => {
				file = new JavascriptUMDFile( 'test/multiple-dependent-libraries/my-library-core/dist/bundles/core.umd.js' );
			} );

			it( 'should not be empty', () => {
				expect( file.isEmpty() ).toBe( false );
			} );

			it( 'should be of ES2015 language level', () => {
				expect( file.isES5LanguageLevel() ).toBe( true );
			} );

			it( 'should be of UMD module format', () => {
				expect( file.isUMDModule() ).toBe( true );
			} );

			it( 'should contain the classes', () => {
				expect( file.hasClass( 'MyLibraryCoreModule' ) ).toBe( true );
				expect( file.hasClass( 'UIFormControlRegistryService' ) ).toBe( true );
			} );

		} );

		describe( 'Output: SourceMaps for UMD bundle', () => {

			let file: SourcemapFile;

			it( 'should exist', () => {
				file = new SourcemapFile( 'test/multiple-dependent-libraries/my-library-core/dist/bundles/core.umd.js.map' );
			} );

			it( 'should not be empty', () => {
				expect( file.isEmpty() ).toBe( false );
			} );

			it( 'should reference the bundle file', () => {
				expect( file.getFileName() ).toBe( 'core.umd.js' );
			} );

			it( 'should reference all the source files', () => {
				expect( file.getSources() ).toEqual( {
					'src/library.module.ts': simplifyFileContent(
						fs.readFileSync( 'test/multiple-dependent-libraries/my-library-core/src/library.module.ts', 'utf-8' )
					),
					'src/form-control-registry/form-control-registry.service.ts': simplifyFileContent(
						fs.readFileSync( 'test/multiple-dependent-libraries/my-library-core/src/form-control-registry/form-control-registry.service.ts', 'utf-8' )
					),
				} );
			} );

		} );

	} );

} );
