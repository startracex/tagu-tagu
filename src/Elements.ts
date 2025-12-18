import type { ElementInitializer } from "./Modify";
import { Html } from "./Tag";

export function button(
	...initializers: ElementInitializer<HTMLButtonElement>[]
) {
	return Html("button", ...initializers);
}
export function Span(...initializers: ElementInitializer<HTMLSpanElement>[]) {
	return Html("span", ...initializers);
}

export function Style(styles: Record<string, Record<string, string>>) {
	function createStyleText(
		selector: string,
		properties: Record<string, string>,
	) {
		return `${selector} {${Object.keys(properties)
			.map((property) => `${property}: ${properties[property]};`)
			.join("")}}`;
	}

	return Html("style", [
		Object.keys(styles)
			.map((selector) => createStyleText(selector, styles[selector]))
			.join(""),
	]);
}

export function Div(...initializers: ElementInitializer<HTMLDivElement>[]) {
	return Html("div", ...initializers);
}
export function FlexDiv(...initializers: ElementInitializer<HTMLDivElement>[]) {
	return Div({ css: { display: "flex" } }, ...initializers);
}

export function Input(...initializers: ElementInitializer<HTMLInputElement>[]) {
	return Html("input", ...initializers);
}

export function Select(
	...initializers: ElementInitializer<HTMLSelectElement>[]
) {
	return Html("select", ...initializers);
}

export function SelectOption(
	...initializers: ElementInitializer<HTMLOptionElement>[]
) {
	return Html("option", ...initializers);
}

export function BR(...initializers: ElementInitializer<HTMLBRElement>[]) {
	return Html("br", ...initializers);
}

export function TableRow(
	...initializers: ElementInitializer<HTMLTableRowElement>[]
) {
	return Html("tr", ...initializers);
}

export function TableData(
	...initializers: ElementInitializer<HTMLTableCellElement>[]
) {
	return Html("td", ...initializers);
}

export function Bold(...initializers: ElementInitializer<HTMLElement>[]) {
	return Html("b", ...initializers);
}

export function Label(...initializers: ElementInitializer<HTMLLabelElement>[]) {
	return Html("label", ...initializers);
}

export function Anchor(
	...initializers: ElementInitializer<HTMLAnchorElement>[]
) {
	return Html("a", ...initializers);
}

export function BlockQuote(
	...initializers: ElementInitializer<HTMLQuoteElement>[]
) {
	return Html("blockquote", ...initializers);
}

export function ListItem(...initializers: ElementInitializer<HTMLLIElement>[]) {
	return Html("li", ...initializers);
}

export function OrderedList(
	...initializers: ElementInitializer<HTMLOListElement>[]
) {
	return Html("ol", ...initializers);
}

export function UnorderedList(
	...initializers: ElementInitializer<HTMLUListElement>[]
) {
	return Html("ul", ...initializers);
}

export function Audio(...initializers: ElementInitializer<HTMLAudioElement>[]) {
	return Html("audio", ...initializers);
}

export function Video(...initializers: ElementInitializer<HTMLVideoElement>[]) {
	return Html("video", ...initializers);
}

export function Image(...initializers: ElementInitializer<HTMLImageElement>[]) {
	return Html("img", ...initializers);
}

export function Canvas(
	...initializers: ElementInitializer<HTMLCanvasElement>[]
) {
	return Html("canvas", ...initializers);
}

export function IFrame(
	...initializers: ElementInitializer<HTMLIFrameElement>[]
) {
	return Html("iframe", ...initializers);
}

export function Form(...initializers: ElementInitializer<HTMLFormElement>[]) {
	return Html("form", ...initializers);
}

export function Table(...initializers: ElementInitializer<HTMLTableElement>[]) {
	return Html("table", ...initializers);
}

export function TableBody(
	...initializers: ElementInitializer<HTMLTableSectionElement>[]
) {
	return Html("tbody", ...initializers);
}

export function HorizontalRule(
	...initializers: ElementInitializer<HTMLHRElement>[]
) {
	return Html("hr", ...initializers);
}
