import * as sass from 'node-sass';

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
            if ( sassContent.length === 0 ) {
                resolve( sassContent );
            } else {
                sass.render( {
                    data: sassContent,
                    outputStyle: 'expanded' // We will minify later on
                }, ( error: Error, sassRenderResult: sass.Result ): void => {
                    resolve( sassRenderResult.css.toString() );
                } );
            }

        } );
    }

}
