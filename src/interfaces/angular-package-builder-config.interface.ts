/**
 * Angular Package Builder Configuration Interface
 */
export interface AngularPackageBuilderConfig {

	/**
	 * Path to the JSON schema file
	 */
	$schema?: string;

	/**
	 * Path to the library entry file
	 */
	entryFile?: string;

	/**
	 * Output directory
	 */
	outputDir?: string;

	/**
	 * Debug flag
	 */
	debug?: boolean;

	/**
	 * TypeScript compiler options
	 */
	compilerOptions?: { [ option: string ]: any };

	/**
	 * Angular compiler options
	 */
	angularCompilerOptions?: { [ option: string ]: any };

	/**
	 * Map of external dependencies (module name -> global name)
	 */
	dependencies?: { [ dependency: string ]: string };

}
