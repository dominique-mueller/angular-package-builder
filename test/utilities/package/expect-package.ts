import { PackageFile } from './package-file';

/**
 * Expect package.json file
 */
export function expectPackage( filePath: string, checks: {
	packageName: string,
} ): void {

	let file: PackageFile;
	const fileName: string = checks.packageName.split( '/' ).pop();

	it( 'should exist and be valid JSON', () => {
		file = new PackageFile( filePath );
	} );

	it( 'should not be empty', () => {
		expect( file.isEmpty() ).toBe( false );
	} );

	it( 'should have the correct package name', () => {
		expect( file.getPackageName() ).toBe( checks.packageName );
	} );

	it( 'should reference the "es2015" entry', () => {
		expect( file.getEntries().es2015 ).toBe( `esm2015/${ fileName }.js` );
	} );

	it( 'should reference the "esm2015" entry', () => {
		expect( file.getEntries().esm2015 ).toBe( `esm2015/${ fileName }.js` );
	} );

	it( 'should reference the "esm5" entry', () => {
		expect( file.getEntries().esm5 ).toBe( `esm5/${ fileName }.js` );
	} );

	it( 'should reference the "fesm2015" entry', () => {
		expect( file.getEntries().fesm2015 ).toBe( `fesm2015/${ fileName }.js` );
	} );

	it( 'should reference the "fesm5" entry', () => {
		expect( file.getEntries().fesm5 ).toBe( `fesm5/${ fileName }.js` );
	} );

	it( 'should reference the "module" entry (ESM5 build entry)', () => {
		expect( file.getEntries().module ).toBe( `esm5/${ fileName }.js` );
	} );

	it( 'should reference the "main" entry (UMD bundle)', () => {
		expect( file.getEntries().main ).toBe( `bundles/${ fileName }.umd.js` );
	} );

	it( 'should reference the "typings" entry', () => {
		expect( file.getEntries().typings ).toBe( `${ fileName }.d.ts` );
	} );

}
