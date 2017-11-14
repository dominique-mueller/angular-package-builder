import * as CleanCSS from 'clean-css';

/**
 * Correct old clean css output interface
 */
interface CleanCSSOutput extends CleanCSS.Output {
    level?: number;
}

/**
 * Minify CSS content
 *
 * @param   cssContent - Original CSS content
 * @returns            - Minified CSS content
 */
export function minifyCss( cssContent: string ): string {
    const result: CleanCSS.Output = new CleanCSS( <CleanCSSOutput> {
        level: 0 // No optimization
    } ).minify( cssContent );
    return result.styles;
}
