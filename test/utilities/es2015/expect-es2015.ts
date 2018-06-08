import { JavascriptES2015File } from './es2015-file';

/**
 * Expect ES2015 file
 */
export function expectES2015( filePath: string, checks?: {
	classNames?: Array<string>
} ): void {

	let file: JavascriptES2015File;

	it( 'should exist', () => {
		file = new JavascriptES2015File( filePath );
	} );

	it( 'should not be empty', () => {
		expect( file.isEmpty() ).toBe( false );
	} );

	if ( checks && checks.classNames ) {

		it( 'should be of ES2015 language level', () => {
			expect( file.isES2015LanguageLevel() ).toBe( true );
		} );

		it( 'should be of ES module format', () => {
			expect( file.isESModule() ).toBe( true );
		} );

		it( 'should contain the classes', () => {
			checks.classNames.forEach( ( className: string ): void => {
				expect( file.hasClass( className ) ).toBe( true );
			} );
		} );
	}

}
