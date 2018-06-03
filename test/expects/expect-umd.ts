import { JavascriptUMDFile } from '../utilities/umd-file';

/**
 * Expect UMD file
 */
export function expectUMD( filePath: string, checks?: {
	classNames?: Array<string>
} ): void {

	let file: JavascriptUMDFile;

	it( 'should exist', () => {
		file = new JavascriptUMDFile( filePath );
	} );

	it( 'should not be empty', () => {
		expect( file.isEmpty() ).toBe( false );
	} );

	if ( checks && checks.classNames ) {

		it( 'should be of ES5 language level', () => {
			expect( file.isES5LanguageLevel() ).toBe( true );
		} );

		it( 'should be of UMD module format', () => {
			expect( file.isUMDModule() ).toBe( true );
		} );

		it( 'should contain the classes', () => {
			checks.classNames.forEach( ( className: string ): void => {
				expect( file.hasClass( className ) ).toBe( true );
			} );
		} );

	}

}
