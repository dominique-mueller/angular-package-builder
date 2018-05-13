import { AngularExternalTemplate } from './angular-external-resources.interfaces';
import { HTMLTransformer } from '../languages/html.transformer';
import { getFileType } from '../../utilities/get-file-type';

/**
 * Angular External Templates File Transformer
 */
export class AngularExternalTemplatesFileTransformer {

    /**
     * Inline external template (manipulates source code!)
     *
     * @param externalTemplate External template
     * @param template         Template
     */
    public static async inlineExternalTemplate( externalTemplate: AngularExternalTemplate, template: string ): Promise<void> {

        // Prepare template
        const preparedTemplate: string = this.prepareTemplate( template, getFileType( externalTemplate.template.path ) );

        // Rewrite assignment
        externalTemplate.node.replaceWithText( 'template' );
        externalTemplate.template.node.replaceWithText( `'${ preparedTemplate }'` );

    }

    /**
     * Prepare template
     *
     * @param   template Template
     * @param   fileType File type
     * @returns          Prepared template
     */
    private static prepareTemplate( template: string, fileType: string ): string {

        switch ( fileType ) {
            case 'html':
                return HTMLTransformer.minify( template );
            default:
                throw new Error( 'Unsupported file!' );
        }

    }

}