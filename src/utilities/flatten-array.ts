/**
 * Flatten the given array, until completely flat
 *
 * @param   array Array to flatten
 * @returns       Flattened array
 */
export function flattenArray( array: Array<Array<any>> ): Array<any> {
    const flattenedArray: Array<any> = [].concat( ...array );
    return flattenedArray.some( Array.isArray )
        ? flattenArray( flattenedArray )
        : flattenedArray;
}
