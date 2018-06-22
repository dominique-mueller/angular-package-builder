import { render, Result, SassError } from 'node-sass';
import * as nodeSassTildeImporter from 'node-sass-tilde-importer';

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
                    importer: [
                        nodeSassTildeImporter
                    ],
                    outputStyle: 'expanded' // We will minify later on
                }, ( error: SassError, sassRenderResult: Result ): void => {

                    // Handle error
                    if ( error ) {
                        reject( new Error( `SASS Compiler: ${error.message} (at ${error.line}:${error.column})` ) );
                        return;
                    }

                    resolve( sassRenderResult.css.toString() );

                } );
            }

        } );
    }

}
