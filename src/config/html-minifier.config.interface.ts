/**
 * HTML Minifier Config Interface
 */
export interface HTMLMinifierConfig {
    caseSensitive?: boolean;
    collapseBooleanAttributes?: boolean;
    collapseInlineTagWhitespace?: boolean;
    collapseWhitespace?: boolean;
    conservativeCollapse?: boolean;
    decodeEntities?: boolean;
    html5?: boolean;
    keepClosingSlash?: boolean;
    maxLineLength?: boolean;
    preserveLineBreaks?: boolean;
    preventAttributesEscaping?: boolean;
    processConditionalComments?: boolean;
    quoteCharacter?: string;
    removeAttributeQuotes?: boolean;
    removeComments?: boolean;
    removeEmptyAttributes?: boolean;
    removeEmptyElements?: boolean;
    removeOptionalTags?: boolean;
    removeRedundantAttributes?: boolean;
    removeScriptTypeAttributes?: boolean;
    removeStyleLinkTypeAttributes?: boolean;
    removeTagWhitespace?: boolean;
    sortAttributes?: boolean;
    sortClassName?: boolean;
    trimCustomFragments?: boolean;
    useShortDoctype?: boolean;
};
