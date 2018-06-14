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
    public static minify( cssContent: string ): string {

        // Minify CSS, skip if empty
        if ( cssContent.trim() === '' ) {
            return '';
        } else {

            // Minify
            const minified: CleanCSS.Output = new CleanCSS( <any>{
                level: 0 // No optimization
            } ).minify( cssContent );

            // Handle errors
            if ( minified.errors.length > 0 ) {
                throw new Error( `CSS Minifier: ${ minified.errors.join( '\n' ) }` ); // No idea when this actually happens ...
            }

            return minified.styles;

        }

    }

}
