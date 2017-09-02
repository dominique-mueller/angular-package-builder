/**
 * Normalize line endings to LF (unix)
 *
 * @param   content - Original content
 * @returns         - Content with normalized line endings
 */
export function normalizeLineEndings( content ): string {
	return content.replace( /\r\n|\r|\n/g, '\n' );
}
