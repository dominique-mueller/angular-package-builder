import { MemoryFileSystem } from '../memory-file-system/memory-file-system';

/**
 * Angular Package Builder Internal Configuration Interface (derived from Angular Package Builder Config)
 */
export interface AngularPackageBuilderInternalConfig {
	debug?: boolean;
	entry?: {
		folder?: string;
		file?: string;
	};
	output?: {
		folder?: string;
	};
	temporary?: {
		folder?: string;
		prepared?: string;
		buildES5?: string;
		buildES2015?: string;
		bundleFESM2015?: string;
		bundleFESM5?: string;
		bundleUMD?: string;
	};
	memoryFileSystem?: MemoryFileSystem | null;
	packageName?: string;
	dependencies?: { [ dependency: string ]: string };
	compilerOptions?: { [ option: string ]: any };
	angularCompilerOptions?: { [ option: string ]: any };
	ignored?: Array<string>;
}
