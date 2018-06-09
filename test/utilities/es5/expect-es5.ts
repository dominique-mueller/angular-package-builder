import { JavascriptES5File } from './es5-file';

/**
 * Expect ES5 file
 */
export function expectES5( filePath: string, checks?: {
	classNames?: Array<string>
} ): void {

	let file: JavascriptES5File;

	it( 'should exist', () => {
		file = new JavascriptES5File( filePath );
	} );

	it( 'should not be empty', () => {
		expect( file.isEmpty() ).toBe( false );
	} );

	if ( checks && checks.classNames && checks.classNames.length > 0 ) {

		it( 'should be of ES5 language level', () => {
			expect( file.isES5LanguageLevel() ).toBe( true );
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
