import * as htmlMinifier from 'html-minifier';

/**
 * Minify HTML content
 *
 * @param   htmlContent - Original HTML content
 * @returns             - Minified HTML content
 */
export function minifyHtml( htmlContent: string ): string {
	return htmlMinifier.minify( htmlContent, {
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
	} );
}
