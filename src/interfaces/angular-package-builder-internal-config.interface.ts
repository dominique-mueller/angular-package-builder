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
	packageName?: string;
	dependencies?: { [ dependency: string ]: string };
	compilerOptions?: { [ option: string ]: any };
	ignored?: Array<string>;
}
