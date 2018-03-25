import { MemoryFileSystem } from './memory-file-system/memory-file-system';

/**
 * Angular Package Builder Internal Configuration Interface (derived from Angular Package Builder Config)
 */
export interface AngularPackageBuilderInternalConfig {
	cwd: string;
	entry: {
		folder: string;
		file: string;
	};
	output: {
		folder: string;
	};
	temporary: {
		esm2015: string;
		esm5: string;
		fesm2015: string;
		fesm5: string;
		folder: string;
		prepared: string;
		umd: string;
	};
	packageName: string;
	fileName: string;
	dependencies: { [ dependency: string ]: string };
	typescriptCompilerOptions: { [ option: string ]: any };
	angularCompilerOptions: { [ option: string ]: any };
}
