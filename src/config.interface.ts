/**
 * Angular Packages Configuration Interface
 */
export interface AngularPackageConfig {

	/**
	 * Path to the JSON schema file
	 */
	$schema?: string;

	/**
	 * Path to the package entry file
	 */
	entryFile: string;

	/**
	 * Output directory
	 */
	outDir: string;

	/**
	 * List of secondary entries
	 */
	secondaryEntries?: Array<AngularSubPackageConfig>;

	/**
	 * TypeScript compiler options
	 */
	typescriptCompilerOptions?: { [ option: string ]: any };

	/**
	 * Angular compiler options
	 */
	angularCompilerOptions?: { [ option: string ]: any };

	/**
	 * Map of external dependencies (module name -> global name)
	 */
	dependencies?: { [ dependency: string ]: string };

}

/**
 * Angular Sub-Package (aka secondary entry) Configuration Interface
 */
export interface AngularSubPackageConfig {

	/**
	 * Path to the package entry file
	 */
	entryFile: string;

}

/**
 * Angular Packages Configuration Interface
 */
export interface AngularPackageOptions {

	/**
	 * Path to the package entry file
	 */
	entryFile: string;

	/**
	 * Output directory
	 */
	outDir: string;

	/**
	 * TypeScript compiler options
	 */
	typescriptCompilerOptions?: { [ option: string ]: any };

	/**
	 * Angular compiler options
	 */
	angularCompilerOptions?: { [ option: string ]: any };

	/**
	 * Map of external dependencies (module name -> global name)
	 */
	dependencies?: { [ dependency: string ]: string };

}








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
	outDir?: string;

	/**
	 * TypeScript compiler options
	 */
	typescriptCompilerOptions?: { [ option: string ]: any };

	/**
	 * Angular compiler options
	 */
	angularCompilerOptions?: { [ option: string ]: any };

	/**
	 * Map of external dependencies (module name -> global name)
	 */
	dependencies?: { [ dependency: string ]: string };

}
