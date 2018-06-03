import * as fs from 'fs';

import { runAngularPackageBuilder } from '../index';

import { JavascriptES2015File } from './utilities/es2015-file';
import { JavascriptES5File } from './utilities/es5-file';
import { JavascriptUMDFile } from './utilities/umd-file';
import { SourcemapFile } from './utilities/sourcemap-file';
import { simplifyFileContent } from './utilities/simplify-file-content';
import { expectES2015 } from './expects/expect-es2015';
import { expectES5 } from './expects/expect-es5';
import { expectUMD } from './expects/expect-umd';

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
			expectES2015( 'test/multiple-dependent-libraries/my-library-core/dist/fesm2015/core.js', {
				classNames: [
					'MyLibraryCoreModule',
					'UIFormControlRegistryService'
				]
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
			expectES5( 'test/multiple-dependent-libraries/my-library-core/dist/fesm5/core.js', {
				classNames: [
					'MyLibraryCoreModule',
					'UIFormControlRegistryService'
				]
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
			expectUMD( 'test/multiple-dependent-libraries/my-library-core/dist/bundles/core.umd.js', {
				classNames: [
					'MyLibraryCoreModule',
					'UIFormControlRegistryService'
				]
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
