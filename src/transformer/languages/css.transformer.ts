import * as CleanCSS from 'clean-css';

/**
 * CSS Transformer
 */
export class CSSTransformer {

    /**
     * Minify CSS
     *
     * @param   cssContent CSS content
     * @returns            Minified CSS content
     */
    public static minify( cssContent: string ): Promise<string> {
        return new Promise<string>( ( resolve: ( cssContent: string ) => void, reject: ( error: Error ) => void ): void => {

            // Minify CSS, skip if empty
            if ( cssContent.trim() === '' ) {
                resolve( '' );
            } else {

                // Minify
                const minified: CleanCSS.Output = new CleanCSS( <any>{
                    level: 0 // No optimization
                } ).minify( cssContent );

                // Handle errors
                if ( minified.errors.length > 0 ) {
                    reject( new Error( minified.errors.join( '\n' ) ) );
                    return;
                }

                resolve( minified.styles );

            }

        } );
    }

}
