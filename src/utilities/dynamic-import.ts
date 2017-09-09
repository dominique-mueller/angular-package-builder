import * as proxyquire from 'proxyquire';

import { MemoryFileSystem } from './../memory-file-system';

/**
 * Dynamically import a module, change filesystem if necessary
 *
 * @param   module           - Module to import, either name or path
 * @param   memoryFileSystem - Memory File System
 * @returns
 */
export async function dynamicImport( moduleToImport: string, memoryFileSystem: MemoryFileSystem | null ): Promise<any> {
	return ( memoryFileSystem === null )
		? import( moduleToImport )
		: ( <any> proxyquire )( moduleToImport, { fs: memoryFileSystem.fs } );
}
