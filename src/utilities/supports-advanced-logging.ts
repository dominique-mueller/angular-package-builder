/**
 * Checks if advanced logging (e.g. deleting logged lines) is supported
 */
export function supportsAdvancedLogging(): boolean {
	return process.stdout.isTTY === true;
}
