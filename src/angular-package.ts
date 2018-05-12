import { posix as path } from 'path';
import { AngularPackageConfig } from './config.interface';
import { readFile } from './utilities/read-file';

/**
 * Angular Package
 */
export class AngularPackage {

	/**
	 * Angular Package project directory
	 */
    public cwd: string;

    /**
     * Entry file path (relative to cwd)
     */
    public entryFile: string;

    /**
     * Output directory path (relative to cwd)
     */
    public outDir: string;

    /**
     * Package name
     */
    public packageName: string;

	/**
	 * Custom TypeScript compiler options
	 */
    public typescriptCompilerOptions: { [ option: string ]: any };

	/**
	 * Custom Angular compiler options
	 */
    public angularCompilerOptions: { [ option: string ]: any };

    public dependencies: any;

    public async withConfig( absoluteAngularPackageJsonPath: string ): Promise<void> {

        this.cwd = path.dirname( absoluteAngularPackageJsonPath );

        // Read files
        // TODO: Error handling
        const angularPackageJson: AngularPackageConfig = await readFile( absoluteAngularPackageJsonPath );
        const absolutePackageJsonPath: string = path.join( this.cwd, 'package.json' );
        const packageJson: any = await readFile( absolutePackageJsonPath );

        // Get primary entry information
        this.entryFile = path.normalize( angularPackageJson.entryFile );
        this.outDir = path.normalize( angularPackageJson.outDir );
        this.packageName = packageJson.name;

        // Get secondary entry information
        // this.secondaryEntries = ( angularPackageJson.secondaryEntries || [] )
        //     .map( ( secondaryEntry: AngularSubPackageConfig ): AngularPackageConfigInternal => {
        //         const entryFile: string = path.normalize( secondaryEntry.entryFile );
        //         const relativeEntryDir: string = path.relative( path.dirname( this.entry.entryFile ), path.dirname( entryFile ) );
        //         const outDir: string = path.join( this.entry.outDir, relativeEntryDir );
        //         const packageName: string = [ this.entry.packageName, relativeEntryDir ].join( '/' );
        //         const fileName: string = packageName.split( '/' ).pop();
        //         return { entryFile, fileName, outDir, packageName };
        //     } );

        // Get compiler options
        this.typescriptCompilerOptions = angularPackageJson.typescriptCompilerOptions || {};
        this.angularCompilerOptions = angularPackageJson.angularCompilerOptions || {};

        // TODO: Dependencies
        // TODO: Angular Package JSON Schema Validation
        // TODO: Error Handling

    }

}
