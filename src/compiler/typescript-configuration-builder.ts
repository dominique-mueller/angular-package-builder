import { posix as path } from 'path';

/**
 * TypeScript Configuartion Builder
 */
export class TypeScriptConfigurationBuilder {

	/**
	 * List of entry files
	 */
	private files: Array<string>;

	/**
	 * TypeScript compiler options
	 */
	private compilerOptions: any;

	/**
	 * Angualr compiler options
	 */
	private angularCompilerOptions: any;

	/**
	 * TypeScript compilation targets
	 */
	private static readonly compilationTargets: { [ target: string ]: string } = {
		'esm2015': 'ES2015',
		'esm5': 'ES5'
	};

	/**
	 * Constructor
	 */
	constructor() {
		this.compilerOptions = this.getBaseTypeScriptCompilerOptions();
		this.files = [];
		this.angularCompilerOptions = this.getBaseAngularCompilerOptions();
	}

	/**
	 * Add entry files
	 *
	 * @param   files Entry files
	 * @returns       This instance of the TypeScript configuration builder
	 */
	public addEntryFiles( files: Array<string> ): TypeScriptConfigurationBuilder {
		this.files = [ ...this.files, ...files ];
		return this;
	}

	/**
	 * Add entry directory path
	 *
	 * @param   entryDir Entry directory path
	 * @returns          This instance of the TypeScript configuration builder
	 */
	public withEntryDir( entryDir: string ): TypeScriptConfigurationBuilder {
		this.compilerOptions.rootDir = entryDir;
		this.compilerOptions.sourceRoot = entryDir;
		return this;
	}

	/**
	 * Add output directory path
	 *
	 * @param   outDir Output directory path
	 * @returns        This instance of the TypeScript configuration builder
	 */
	public withOutDir( outDir: string ): TypeScriptConfigurationBuilder {
		this.compilerOptions.outDir = outDir;
		return this;
	}

	/**
	 * Add package name
	 *
	 * @param   packageName Package name
	 * @returns             This instance of the TypeScript configuration builder
	 */
	public withName( packageName: string ): TypeScriptConfigurationBuilder {
		const fileName: string = packageName.split( '/' ).pop();
		this.angularCompilerOptions.flatModuleId = packageName; // Name of the package, used when importing from the library
		this.angularCompilerOptions.flatModuleOutFile = `${ fileName }.js`; // Name of the output file
		return this;
	}

	/**
	 * Add compilation target
	 *
	 * @param   target Compilation target
	 * @returns        This instance of the TypeScript configuration builder
	 */
	public toTarget( target: 'esm2015' | 'esm5' ): TypeScriptConfigurationBuilder {
		this.compilerOptions.target = TypeScriptConfigurationBuilder.compilationTargets[ target ];
		return this;
	}

	/**
	 * Build
	 *
	 * @returns TypeScript configuration
	 */
	public build(): any {
		return {
			compilerOptions: this.compilerOptions,
			files: this.files,
			angularCompilerOptions: this.angularCompilerOptions
		};
	}

	/**
	 * Get base TypeScript compiler options
	 *
	 * @returns TypeScript compiler options
	 */
	private getBaseTypeScriptCompilerOptions(): any {
		return {
			declaration: true, // Emit TypeScript definition files (*.d.ts) for JavaScript type checking
			emitDecoratorMetadata: true, // Keep metadata about decorators
			experimentalDecorators: true, // Enable decorators
			lib: [ // Defaults (see https://www.typescriptlang.org/docs/handbook/compiler-options.html)
				'es6',
				'dom',
				'dom.iterable',
				'scripthost'
			],
			module: 'ES2015', // Always generate ES6 modules, meaning we use 'import' and 'export'
			moduleResolution: 'node', // Module resolution strategy
			newLine: 'LF', // Always use 'LF' as line endings in order to make closure compiler annotations work correctly
			pretty: true, // Pretty error messages
			sourceMap: true // Emit sourcemap files
		};
	}

	/**
	 * Get base Angular Compiler Options
	 *
	 * @returns Angular compiler options
	 */
	private getBaseAngularCompilerOptions(): any {
		return {
			annotateForClosureCompiler: true, // Generate specific annoation (only works with 'LF' line endings)
			preserveWhitespaces: false, // Remove whitespaces for smaller bundles (#perfmatters)
			skipTemplateCodegen: true, // Do not pre-compile templates
			strictMetadataEmit: true // Validate emitted metadata
		};
	}

}
