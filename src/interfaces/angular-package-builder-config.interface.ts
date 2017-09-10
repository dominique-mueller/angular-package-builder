/**
 * Angular Package Builder Configuration Interface
 */
export interface AngularPackageBuilderConfig {
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
	dependencies?: Array<string>;
	ignored?: Array<string>;
}
