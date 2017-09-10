/**
 * Package JSON interface
 */
export interface PackageJson {
	dependencies?: { [ dependency: string ]: string };
	name?: string;
	optionalDependencies?: { [ dependency: string ]: string };
	peerDependencies?: { [ dependency: string ]: string };
	[ key: string ]: any;
}
