/**
 * Simplify file content by removing all line breaks, tabs, spaces (better for comparison)
 */
export function simplifyFileContent( fileContent: string ): string {
	return fileContent
		.replace( /[\r\n\t ]/g, '' )
		.trim();
}
