import { posix as path } from 'path';

import { JavascriptES2015File } from './es2015/es2015-file';
import { JavascriptES5File } from './es5/es5-file';
import { MetadataFile } from './metadata/metadata-file';

/**
 * Expect inline styles
 */
export function expectInlineStyle( distPath: string, packageName: string, sourcePath: string, componentType: string, expectedStyle: string ): void {

	const fileName: string = packageName.split( '/' ).slice( -1 )[ 0 ];

	it( 'should inline into ES2015 build', async() => {
		const file: JavascriptES2015File = new JavascriptES2015File( path.join( distPath, 'esm2015', `${ sourcePath }.js` ) );
		expect( file.getInlineStyles() ).toContain( expectedStyle );
	} );

	it( 'should inline into FESM2015 bundle', async() => {
		const file: JavascriptES2015File = new JavascriptES2015File( path.join( distPath, 'fesm2015', `${ fileName }.js` ) );
		expect( file.getInlineStyles() ).toContain( expectedStyle );
	} );

	it( 'should inline into ES5 build', async() => {
		const file: JavascriptES5File = new JavascriptES5File( path.join( distPath, 'esm5', `${ sourcePath }.js` ) );
		expect( file.getInlineStyles() ).toContain( expectedStyle );
	} );

	it( 'should inline into FESM5 bundle', async() => {
		const file: JavascriptES5File = new JavascriptES5File( path.join( distPath, 'fesm5', `${ fileName }.js` ) );
		expect( file.getInlineStyles() ).toContain( expectedStyle );
	} );

	it( 'should inline into Angular Metadata', async() => {
		const file: MetadataFile = new MetadataFile( path.join( distPath, `${ fileName }.metadata.json` ) );
		expect( file.getInlinedStyles( componentType ) ).toContain( expectedStyle );
	} );

}
