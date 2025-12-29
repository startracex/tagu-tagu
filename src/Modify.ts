import { type DataRecord, initializeData, waitForData } from "./data/data";
import { Binding } from "./data/useBinding";
import { type ChildType, initializeChildBlock } from "./initializeChildBlock";
import { State, useComputed } from "./State";

type EventListenerType<
	TEventType2Event,
	TEventType extends keyof TEventType2Event,
> = (event: TEventType2Event[TEventType]) => any;

type EventListenerRecord<TEventType2Event> = {
	[TEventType in keyof TEventType2Event]?:
		| EventListenerType<TEventType2Event, TEventType>
		| Binding
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
	html?: string | State | Binding;
	text?: string | State | Binding;
	attr?: Record<string, string | State | Binding>;
	prop?: Record<string, any | State | Binding>;
	css?: Record<string, string | State | Binding>;
	on?: EventListenerRecord<TEventType2Event>;
	$?: $Record;
	$$?: $Record;
	data?: DataRecord;
	animate?: number | AnimationOptions;
};

type AnimationOptions = {
	duration?: number;
	easing?: string;
};

export type ElementInitializer<
	TElement,
	TEventType2Event = HTMLElementEventMap,
> =
	| string
	| State
	| ElementPropertyInitializer<TEventType2Event>
	| ChildType[]
	| ((element: TElement) => any);

export function applyStringOrState(
	value: string | State,
	initialize: (text: string) => void,
) {
	if (typeof value === "string") {
		initialize(value);
	} else if (value instanceof State) {
		const update = () => {
			initialize(value.get());
		};
		update();
		value.on(update);
	} else {
		initialize(value);
	}
}

function applyStringOrStateOrBinding(
	element: Node,
	value: string | State | Binding,
	initialize: (text: string) => void,
) {
	if (value instanceof Binding) {
		waitForData(element, {
			[value.key]: (data: any) => {
				const isState = data instanceof State;
				const stringOrState = isState
					? useComputed([data], () => value.map(data.get()))
					: value.map(data);

				applyStringOrState(stringOrState, initialize);
			},
		});
	} else {
		applyStringOrState(value, initialize);
	}
}

function initializeHtml(
	element: Element,
	html: string | State | Binding | undefined,
) {
	if (html !== undefined) {
		applyStringOrStateOrBinding(element, html, (text) => {
			element.innerHTML = text;
		});
	}
}

function initializeText(
	node: Node,
	text: string | State | Binding | undefined,
) {
	if (text !== undefined) {
		applyStringOrStateOrBinding(node, text, (text) => {
			node.textContent = text;
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
	attr: Record<string, string | State | Binding> | undefined,
) {
	for (const attrName in attr) {
		const value = attr[attrName];
		applyStringOrStateOrBinding(element, value, (text) => {
			if (!text) element.removeAttribute(attrName);
			else {
				element.setAttribute(attrName, text);
			}
		});
	}
}

function initializeProps(
	element: Node,
	prop: Record<string, any | State | Binding> | undefined,
) {
	for (const key in prop) {
		const value = prop[key];
		applyStringOrStateOrBinding(element, value, (resolvedValue) => {
			(element as any)[key] = resolvedValue;
		});
	}
}

function initialize$(element: Element, $: $Record | undefined) {
	const promises = [] as Promise<void>[];

	for (const selector in $) {
		const selected = element.querySelector(selector);
		if (selected) {
			const result = initialize(selected, $[selector]);
			if (result instanceof Promise) promises.push(result);
		}
	}

	if (promises.length !== 0) return Promise.all(promises);
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
		} else if (listener instanceof Binding) {
			waitForData(element, {
				[listener.key]: (data) => {
					const func = listener.map(data);
					element.addEventListener(eventName, func);
				},
			});
		} else {
			element.addEventListener(
				eventName,
				listener.listener as EventListener,
				listener.options,
			);
		}
	}
}

function initializePropertyInitializerWithoutOwnAnimation<
	TElement extends Element,
	TEventType2Event,
>(
	element: TElement,
	initializer: ElementPropertyInitializer<TEventType2Event>,
) {
	initializeHtml(element, initializer.html);
	initializeText(element, initializer.text);
	initializeAttributes(element, initializer.attr);
	initializeProps(element, initializer.prop);
	initializeStyle(element, initializer.css);
	const result$ = initialize$(element, initializer.$);
	initialize$$(element, initializer.$$);
	initializeEventListeners(element, initializer.on);
	initializeData(element, initializer.data);
	return result$;
}

function initializePropertyInitializerWithAnimation<
	TElement extends Element,
	TEventType2Event,
>(
	element: TElement,
	initializer: ElementPropertyInitializer<TEventType2Event>,
) {
	const css = {} as Record<string, string>;
	for (const key in initializer.css) {
		const value = initializer.css[key];
		if (typeof value === "string") {
			css[key] = value;
		}
		if (value instanceof State) {
			css[key] = value.get();
		}
	}

	const options = initializer.animate;
	if (options && typeof options !== "number") {
		options.duration ??= 400;
		options.easing ??= "swing";
		options.easing =
			options.easing === "swing" ? "ease-in-out" : options.easing;
	}

	const animation = element.animate([{}, css], options);
	return animation.finished.then(() =>
		initializePropertyInitializerWithoutOwnAnimation(element, initializer),
	);
}

function initialize<TElement extends Element, TEventType2Event>(
	element: TElement | null,
	initializer: ElementInitializer<TElement, TEventType2Event>,
) {
	if (!element) return;
	if (typeof initializer === "string" || initializer instanceof State) {
		initializeText(element, initializer);
	} else if (Array.isArray(initializer)) {
		initializeChildBlock(element, initializer);
	} else if (typeof initializer === "function") {
		const result = initializer(element);
		if (result instanceof Promise) return result;
	} else {
		if (initializer.animate !== undefined) {
			return initializePropertyInitializerWithAnimation(element, initializer);
		}
		return initializePropertyInitializerWithoutOwnAnimation(
			element,
			initializer,
		);
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

	(async () => {
		for (const initializer of initializers) {
			const animation = initialize(element, initializer);
			if (animation) await animation;
		}
	})();

	return element;
}

export function ModifyAll(
	selector: string,
	...initializers: ElementInitializer<Element>[]
) {
	for (const element of document.querySelectorAll(selector)) {
		Modify<Element>(element, ...initializers);
	}
}

export function ModifyAsync<T extends Element>(
	elementOrSelector: T | string,
	...initializers: ElementInitializer<T>[]
) {
	return new Promise<T>((resolve) => {
		Modify(elementOrSelector, ...initializers, (e) => {
			resolve(e);
		});
	});
}
