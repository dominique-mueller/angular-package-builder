import * as fs from 'fs';

/**
 * Typings File Wrapper
 */
export class TypingsFile {

    public typingsFile: any;

    public fromSource( path: string ): void {
        this.typingsFile = fs.readFileSync( path, 'utf-8' );
    }

}
