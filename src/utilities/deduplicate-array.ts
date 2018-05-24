/**
 * Deduplicate array
 *
 * Inspired by: https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
 *
 * @param   array Array containing possible duplicated
 * @returns       Array without any duplicates
 */
export function deduplicateArray( array: Array<string> ): Array<string> {
    return [ ...new Set( array ) ]; // How fancy is that? :O
}
