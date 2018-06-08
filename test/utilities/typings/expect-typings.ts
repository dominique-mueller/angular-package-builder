import { TypingsFile } from './typings-file';

/**
 * Expect Typings file
 */
export function expectTypings( filePath: string, checks?: {
	classNames?: Array<string>
} ): void {

	let file: TypingsFile;

	it( 'should exist', () => {
		file = new TypingsFile( filePath );
	} );

	it( 'should not be empty', () => {
		expect( file.isEmpty() ).toBe( false );
	} );

	if ( checks && checks.classNames ) {

		it( 'should contain the classes', () => {
			checks.classNames.forEach( ( className: string ): void => {
				expect( file.hasClass( className ) ).toBe( true );
			} );
		} );

	}

}
