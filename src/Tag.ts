import { div } from "./Elements";
import { type ElementInitializer, Modify } from "./Modify";

export type SvgElementInitializer =
	| {
			attr?: Record<string, string>;
			css?: Record<string, string>;
	  }
	| Element[];

export function Svg<K extends keyof SVGElementTagNameMap>(
	name: K,
	...initializers: SvgElementInitializer[]
): SVGElementTagNameMap[K] {
	const result = document.createElementNS("http://www.w3.org/2000/svg", name);
	return Modify(result, ...initializers);
}

export function Html<K extends keyof HTMLElementTagNameMap>(
	tagName: K,
	...initializers: ElementInitializer<HTMLElementTagNameMap[K]>[]
) {
	const result = document.createElement(tagName);
	Modify(result, ...initializers);
	return result;
}

export function Tag(
	html: string,
	...initializers: ElementInitializer<Element>[]
) {
	const result = div({ html: html }).children[0];
	return Modify(result, ...initializers);
}
