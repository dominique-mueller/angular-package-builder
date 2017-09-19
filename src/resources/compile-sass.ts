import * as sass from 'node-sass';

/**
 * Compile SASS into CSS
 *
 * @param   sassContent - SASS content
 * @returns             - CSS content
 */
export function compileSass( sassContent: string ): Promise<string> {
	return new Promise<string>( ( resolve: ( cssContent: string ) => void, reject: ( error: Error ) => void ) => {

		// Compile SASS into CSS
		sass.render( {
			data: sassContent,
			outputStyle: 'expanded' // We will minify later on
        }, ( error: Error, sassRenderResult: sass.Result ) => {

			resolve( sassRenderResult.css.toString() );

		} );

	} );
}


