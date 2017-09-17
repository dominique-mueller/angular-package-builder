import * as htmlMinifier from 'html-minifier';

import { htmlMinifierConfig } from './../config/html-minifier.config';

/**
 * Minify HTML content
 *
 * @param   htmlContent - Original HTML content
 * @returns             - Minified HTML content
 */
export function minifyHtml( htmlContent: string ): string {
	return htmlMinifier.minify( htmlContent, htmlMinifierConfig );
}
