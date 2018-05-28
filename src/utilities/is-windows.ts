/**
 * Checks if the current operating system is windows
 */
export function isWindows(): boolean {
	return process.platform === 'win32';
}
