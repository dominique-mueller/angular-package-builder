import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Input component
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'ui-input',
	templateUrl: './input.component.html',
	styleUrls: [
		'./input.component.scss'
	]
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
