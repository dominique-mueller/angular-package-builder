import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../data/data.service';

/**
 * Input component
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'my-input',
	templateUrl: './input.component.html',
	styleUrls: [
		'./input.component.scss'
	]
} )
export class InputComponent implements AfterViewInit {

	/**
	 * Data service ID
	 */
	@Input()
	public id: string;

	/**
	 * Model
	 */
	@Input()
	public model: string;

	/**
	 * Label
	 */
	@Input()
	public label: string;

	/**
	 * Model change
	 */
	@Output()
	public modelChange: EventEmitter<string>;

	/**
	 * Init flag
	 */
	private isInitialized: boolean;

	/**
	 * Native element reference, used for manipulating DOM properties
	 */
	private readonly element: HTMLElement;

	/**
	 * Data service
	 */
	private readonly dataService: DataService;

	/**
	 * Constructor
	 *
	 * @param elementRef  - Reference to the component's element
	 * @param dataService - Data service
	 */
	constructor( elementRef: ElementRef, dataService: DataService ) {
		this.model = '';
		this.label = '';
		this.modelChange = new EventEmitter<string>();
		this.isInitialized = false;
		this.element = elementRef.nativeElement;
		this.dataService = dataService;
	}

	/**
	 * Component after view init lifecycle hook, setts up the component and then emits the ready event
	 */
	public ngAfterViewInit(): void {
		this.isInitialized = true;
	}

	/**
	 * Change event listener
	 *
	 * @param newModel - New model
	 */
	public onChange( newModel: string ): void {
		this.modelChange.emit( newModel );
		this.dataService.setData( this.id, newModel );
	}

}
