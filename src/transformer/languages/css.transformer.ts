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
            return new CleanCSS( <any> {
                level: 0 // No optimization
            } )
                .minify( cssContent )
                .styles;
        }

    }

}
