import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

/**
 * Input component
 */
@Component( {
	changeDetection: ChangeDetectionStrategy.OnPush, // (#perfmatters)
	selector: 'input',
	templateUrl: /* './input.component.html' */ './input.component.html',
	styleUrls: [
		'./input.component.scss'
	]
} )
export class InputComponent implements AfterViewInit {

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
	 * Angular renderer
	 */
	private readonly renderer: Renderer2;

	/**
	 * Native element reference, used for manipulating DOM properties
	 */
	private readonly element: HTMLElement;

	/**
	 * Constructor
	 *
	 * @param elementRef - Reference to the component's element
	 * @param renderer   - Angular renderer
	 */
	constructor( elementRef: ElementRef, renderer: Renderer2 ) {
		this.model = '';
		this.label = '';
		this.modelChange = new EventEmitter<string>();
		this.isInitialized = false;
		this.renderer = renderer;
		this.element = elementRef.nativeElement;
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
		this.modelChange.emit( newModel )
	}

}
