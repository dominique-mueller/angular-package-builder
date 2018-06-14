import { HTMLTransformer } from '../languages/html.transformer';
import { getFileType } from '../../utilities/get-file-type';
import { AngularExternalTemplate } from '../external-resources/angular-external-resources.interfaces';

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
                throw new Error( `Angular Package Builder: The file type "${ fileType }" is not supported for external templates.` );
        }

    }

}
