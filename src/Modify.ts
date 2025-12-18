import { type DataRecord, initializeData } from "./data/data";
import { Binding } from "./data/useBinding";
import { type ChildType, initializeChildBlock } from "./initializeChildBlock";
import { FromStates, State } from "./State";

type EventListenerType<
	TEventType2Event,
	TEventType extends keyof TEventType2Event,
> = (event: TEventType2Event[TEventType]) => any;

type EventListenerRecord<TEventType2Event> = {
	[TEventType in keyof TEventType2Event]?:
		| EventListenerType<TEventType2Event, TEventType>
		| {
				listener: EventListenerType<TEventType2Event, TEventType>;
				options: boolean | AddEventListenerOptions;
		  };
};

type $Record = Record<
	string,
	ElementInitializer<Element, HTMLElementEventMap | SVGElementEventMap>
>;

type ElementPropertyInitializer<TEventType2Event> = {
	html?: string | State;
	text?: string | State;
	attr?: Record<string, string | State>;
	prop?: Record<string, any | State>;
	css?: Record<string, string | State | Binding>;
	on?: EventListenerRecord<TEventType2Event>;
	$?: $Record;
	$$?: $Record;
	data?: DataRecord;
};

export type ElementInitializer<
	TElement,
	TEventType2Event = HTMLElementEventMap,
> =
	| ElementPropertyInitializer<TEventType2Event>
	| ChildType[]
	| ((element: TElement) => void);

export function applyStringOrState(
	value: string | State,
	initialize: (text: string) => void,
) {
	if (typeof value === "string") {
		initialize(value);
	} else {
		const update = () => {
			initialize(value.get());
		};
		update();
		value.on("change", update);
	}
}

function applyStringOrStateOrBinding(
	element: Node,
	value: string | State | Binding,
	initialize: (text: string) => void,
) {
	if (value instanceof Binding) {
		initializeData(element, {
			[value.key]: (data: any) => {
				const isState = data instanceof State;
				const stringOrState = isState
					? FromStates([data], () => value.map(data.get()))
					: value.map(data);

				applyStringOrState(stringOrState, initialize);
			},
		});
	} else {
		applyStringOrState(value, initialize);
	}
}

function initializeHtml(element: Element, html: string | State | undefined) {
	if (html !== undefined) {
		applyStringOrState(html, (text) => {
			element.innerHTML = text;
		});
	}
}

function initializeText(element: Node, text: string | State | undefined) {
	if (text !== undefined) {
		applyStringOrState(text, (text) => {
			element.textContent = text;
		});
	}
}

function initializeStyle(
	element: Element,
	css: Record<string, string | State | Binding> | undefined,
) {
	const style = (element as any).style;
	if (!(style instanceof CSSStyleDeclaration)) return;

	for (const propName in css) {
		const value = css[propName];
		applyStringOrStateOrBinding(element, value, (text) =>
			style.setProperty(propName, text),
		);
	}
}

function initializeAttributes(
	element: Element,
	attr: Record<string, string | State> | undefined,
) {
	for (const attrName in attr) {
		const value = attr[attrName];
		applyStringOrState(value, (text) => {
			if (!text) element.removeAttribute(attrName);
			else {
				element.setAttribute(attrName, text);
			}
		});
	}
}

function initializeProps(
	element: Node,
	prop: Record<string, any | State> | undefined,
) {
	for (const key in prop) {
		const value = prop[key];
		applyStringOrState(value, (resolvedValue) => {
			(element as any)[key] = resolvedValue;
		});
	}
}

function initialize$(element: Element, $: $Record | undefined) {
	for (const selector in $) {
		const selected = element.querySelector(selector);
		if (selected) initialize(selected, $[selector]);
	}
}

function initialize$$(element: Element, $$: $Record | undefined) {
	for (const selector in $$) {
		const selectedItems = element.querySelectorAll(selector);
		for (const selected of selectedItems) {
			initialize(selected, $$[selector]);
		}
	}
}

function initializeEventListeners<TEventType2Event>(
	element: Node,
	on: EventListenerRecord<TEventType2Event> | undefined,
) {
	for (const eventName in on) {
		const type = eventName as keyof TEventType2Event;
		const listener = on[type];
		if (!listener) continue;
		if (typeof listener === "function") {
			element.addEventListener(eventName, listener as EventListener);
		} else {
			element.addEventListener(
				eventName,
				listener.listener as EventListener,
				listener.options,
			);
		}
	}
}

function initialize<TElement extends Element, TEventType2Event>(
	element: TElement | null,
	initializer: ElementInitializer<TElement, TEventType2Event>,
) {
	if (!element) return;
	if (Array.isArray(initializer)) {
		initializeChildBlock(element, initializer);
	} else if (typeof initializer === "function") {
		initializer(element);
	} else {
		initializeHtml(element, initializer.html);
		initializeText(element, initializer.text);
		initializeAttributes(element, initializer.attr);
		initializeProps(element, initializer.prop);
		initializeStyle(element, initializer.css);
		initialize$(element, initializer.$);
		initialize$$(element, initializer.$$);
		initializeEventListeners(element, initializer.on);
		initializeData(element, initializer.data);
	}
}

export function Modify<T extends Element>(
	elementOrSelector: T | string,
	...initializers: ElementInitializer<T>[]
) {
	const element =
		typeof elementOrSelector === "string"
			? (document.querySelector(elementOrSelector) as T)
			: elementOrSelector;
	for (const initializer of initializers) {
		initialize(element, initializer);
	}
	return element;
}
