/**
 * Flatten the given array, until completely flat
 *
 * Inspired by: ~i-sadly-do-not-remember~
 *
 * @param   array Array to flatten
 * @returns       Flattened array
 */
export function flattenArray( array: Array<any> ): Array<any> {
    const flattenedArray: Array<any> = [].concat( ...array );
    return flattenedArray.some( Array.isArray )
        ? flattenArray( flattenedArray )
        : flattenedArray;
}
