import { minify } from 'html-minifier';

/**
 * HTML Transformer
 */
export class HTMLTransformer {

    /**
     * Minify HTML
     *
     * @param   htmlContent HTML content
     * @returns             Minified HTML content
     */
    public static minify( htmlContent: string ): string {

        // Minify HTML, skip if empty
        if ( htmlContent.trim() === '' ) {
            return '';
        } else {
            return minify( htmlContent, htmlMinifierConfiguration );
        }

    }

}

/**
 * HTML Minifier Configuration
 */
export const htmlMinifierConfiguration: { [ options: string ]: string | boolean } = {
    caseSensitive: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    conservativeCollapse: false,
    decodeEntities: true,
    html5: true,
    keepClosingSlash: false,
    maxLineLength: false,
    preserveLineBreaks: false,
    preventAttributesEscaping: false,
    processConditionalComments: false,
    quoteCharacter: '"',
    removeAttributeQuotes: false,
    removeComments: true,
    removeEmptyAttributes: true,
    removeEmptyElements: false,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: false,
    sortAttributes: true,
    sortClassName: true,
    trimCustomFragments: false,
    useShortDoctype: true
};
