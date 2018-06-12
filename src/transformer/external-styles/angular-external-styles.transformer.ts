import { AngularExternalStyles, AngularExternalResource } from '../external-resources/angular-external-resources.interfaces';
import { CSSTransformer } from '../languages/css.transformer';
import { getFileType } from '../../utilities/get-file-type';
import { SASSTransformer } from '../languages/sass.transformer';

/**
 * Angular External Styles Transformer
 */
export class AngularExternalStylesTransformer {

    /**
     * Inline external style (manipulates source code!)
     *
     * @param externalStyles External styles
     * @param externalStyle  External style
     * @param style          Style
     */
    public static async inlineExternalStyle( externalStyles: AngularExternalStyles, externalStyle: AngularExternalResource, style: string ):
        Promise<void> {

        // Prepare style
        const preparedStyle: string = await this.prepareStyle( style, getFileType( externalStyle.path ) );

        // Rewrite assignment
        externalStyles.node.replaceWithText( 'styles' );
        externalStyle.node.replaceWithText( `'${ preparedStyle }'` );

    }

    /**
     * Prepare style
     *
     * @param   style    Style
     * @param   fileType File type
     * @returns          Prepared style
     */
    private static async prepareStyle( style: string, fileType: string ): Promise<string> {

        switch ( fileType ) {
            case 'css': // We also pass CSS through the Node SASS compiler to get noticed early if the CSS is invalid
            case 'scss':
            case 'sass':
                return CSSTransformer.minify( await SASSTransformer.compileToCss( style ) );
            default:
                throw new Error( `The file type "${ fileType }" is not supported for external styles.` );
        }

    }

}
