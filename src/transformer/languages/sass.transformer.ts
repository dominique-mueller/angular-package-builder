import { render, Result, SassError } from 'node-sass';

/**
 * SASS Transformer
 */
export class SASSTransformer {

    /**
     * Compile SASS into CSS
     *
     * @param   sassContent SASS content
     * @returns             Compiled CSS content
     */
    public static compileToCss( sassContent: string ): Promise<string> {
        return new Promise<string>( ( resolve: ( sassContent: string ) => void, reject: ( error: Error ) => void ): void => {

            // Compile SASS to CSS, skip if empty
            if ( sassContent.trim() === '' ) {
                resolve( '' );
            } else {
                render( {
                    data: sassContent,
                    outputStyle: 'expanded' // We will minify later on
                }, ( error: SassError, sassRenderResult: Result ): void => {

                    // Handle error
                    if ( error ) {
                        reject( new Error( `SASS compiler: ${error.message} (at ${error.line}:${error.column})` ) );
                        return;
                    }

                    resolve( sassRenderResult.css.toString() );

                } );
            }

        } );
    }

}
