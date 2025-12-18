import type { ElementInitializer } from "./Modify";
import { Html } from "./Tag";

export function h1(...initializers: ElementInitializer<HTMLHeadingElement>[]) {
	return Html("h1", ...initializers);
}
export function h2(...initializers: ElementInitializer<HTMLHeadingElement>[]) {
	return Html("h2", ...initializers);
}
export function h3(...initializers: ElementInitializer<HTMLHeadingElement>[]) {
	return Html("h3", ...initializers);
}
export function h4(...initializers: ElementInitializer<HTMLHeadingElement>[]) {
	return Html("h4", ...initializers);
}
export function h5(...initializers: ElementInitializer<HTMLHeadingElement>[]) {
	return Html("h5", ...initializers);
}
export function h6(...initializers: ElementInitializer<HTMLHeadingElement>[]) {
	return Html("h6", ...initializers);
}
export function p(...initializers: ElementInitializer<HTMLParagraphElement>[]) {
	return Html("p", ...initializers);
}

export function button(
	...initializers: ElementInitializer<HTMLButtonElement>[]
) {
	return Html("button", ...initializers);
}
export function span(...initializers: ElementInitializer<HTMLSpanElement>[]) {
	return Html("span", ...initializers);
}

export function style(styles: Record<string, Record<string, string>>) {
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

export function div(...initializers: ElementInitializer<HTMLDivElement>[]) {
	return Html("div", ...initializers);
}
export function FlexDiv(...initializers: ElementInitializer<HTMLDivElement>[]) {
	return div({ css: { display: "flex" } }, ...initializers);
}

export function input(...initializers: ElementInitializer<HTMLInputElement>[]) {
	return Html("input", ...initializers);
}

export function select(
	...initializers: ElementInitializer<HTMLSelectElement>[]
) {
	return Html("select", ...initializers);
}

export function option(
	...initializers: ElementInitializer<HTMLOptionElement>[]
) {
	return Html("option", ...initializers);
}

export function br(...initializers: ElementInitializer<HTMLBRElement>[]) {
	return Html("br", ...initializers);
}

export function tr(...initializers: ElementInitializer<HTMLTableRowElement>[]) {
	return Html("tr", ...initializers);
}

export function td(
	...initializers: ElementInitializer<HTMLTableCellElement>[]
) {
	return Html("td", ...initializers);
}

export function b(...initializers: ElementInitializer<HTMLElement>[]) {
	return Html("b", ...initializers);
}

export function label(...initializers: ElementInitializer<HTMLLabelElement>[]) {
	return Html("label", ...initializers);
}

export function a(...initializers: ElementInitializer<HTMLAnchorElement>[]) {
	return Html("a", ...initializers);
}

export function blockquote(
	...initializers: ElementInitializer<HTMLQuoteElement>[]
) {
	return Html("blockquote", ...initializers);
}

export function li(...initializers: ElementInitializer<HTMLLIElement>[]) {
	return Html("li", ...initializers);
}

export function ol(...initializers: ElementInitializer<HTMLOListElement>[]) {
	return Html("ol", ...initializers);
}

export function ul(...initializers: ElementInitializer<HTMLUListElement>[]) {
	return Html("ul", ...initializers);
}

export function audio(...initializers: ElementInitializer<HTMLAudioElement>[]) {
	return Html("audio", ...initializers);
}

export function video(...initializers: ElementInitializer<HTMLVideoElement>[]) {
	return Html("video", ...initializers);
}

export function img(...initializers: ElementInitializer<HTMLImageElement>[]) {
	return Html("img", ...initializers);
}

export function canvas(
	...initializers: ElementInitializer<HTMLCanvasElement>[]
) {
	return Html("canvas", ...initializers);
}

export function iframe(
	...initializers: ElementInitializer<HTMLIFrameElement>[]
) {
	return Html("iframe", ...initializers);
}

export function form(...initializers: ElementInitializer<HTMLFormElement>[]) {
	return Html("form", ...initializers);
}

export function table(...initializers: ElementInitializer<HTMLTableElement>[]) {
	return Html("table", ...initializers);
}

export function tbody(
	...initializers: ElementInitializer<HTMLTableSectionElement>[]
) {
	return Html("tbody", ...initializers);
}

export function hr(...initializers: ElementInitializer<HTMLHRElement>[]) {
	return Html("hr", ...initializers);
}
