import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';

import { LibraryFormControlRegistryService } from '@library-circular-dependencies-two/core';

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
export class LibraryInputComponent implements OnInit, OnDestroy {

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
	 * Form control registry service
	 */
	private readonly formControlRegistryService: LibraryFormControlRegistryService;

	/**
	 * Constructor
	 *
	 * @param formControlRegistryService Form control registry service
	 */
	constructor( formControlRegistryService: LibraryFormControlRegistryService ) {
		this.id = null;
		this.label = '';
		this.model = '';
		this.modelChange = new EventEmitter<string>();
		this.formControlRegistryService = formControlRegistryService;
	}

	/**
	 * On Init Lifecycle Hook
	 */
	public ngOnInit(): void {
		if ( this.id ) {
			this.formControlRegistryService.addFormControl( this.id, this );
		}
	}

	/**
	 * On Destroy Lifecycle Hook
	 */
	public ngOnDestroy(): void {
		if ( this.id ) {
			this.formControlRegistryService.removeFormControl( this.id );
		}
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
