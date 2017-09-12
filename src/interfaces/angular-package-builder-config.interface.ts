/**
 * Angular Package Builder Configuration Interface
 */
export interface AngularPackageBuilderConfig {
	$schema?: string;
	entry?: string;
	output?: string;
	debug?: boolean;
	compilerOptions?: { [ option: string ]: any };
	dependencies?: { [ dependency: string ]: string };
}
