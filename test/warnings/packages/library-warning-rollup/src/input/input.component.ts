import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ContentChildren, QueryList } from '@angular/core';

/**
 * Input component
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'ui-input',
	styleUrls: [
		'./input.component.scss'
	],
	templateUrl: './input.component.html'
} )
export class LibraryInputComponent {

	/**
	 * Input ID
	 */
	@Input()
	public id: string | null;

	/**
	 * Input Label
	 */
	@Input()
	public label: string;

	/**
	 * Input Model
	 */
	@Input()
	public model: string;

	/**
	 * Input Model change, emitting the new model value
	 */
	@Output()
	public modelChange: EventEmitter<string>;

	/**
	 * Input elements
	 *
	 * We are using a bug to let rollup emit a warning for us
	 * See: https://github.com/angular/angular/issues/21280
	 */
	@ContentChildren( 'input' )
	public inputElement: QueryList<any>;

	/**
	 * Constructor
	 */
	constructor() {
		this.id = null;
		this.label = '';
		this.model = '';
		this.modelChange = new EventEmitter<string>();
	}

	/**
	 * Change event listener
	 *
	 * @param newModel - New model
	 */
	public onChange( newModel: string ): void {
		this.modelChange.emit( newModel );
	}

}
