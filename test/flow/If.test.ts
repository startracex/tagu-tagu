import { describe, expect, it } from "vitest";
import { div, If, useState } from "../../src";

describe(If, () => {
	it("[Div, If, If]", () => {
		const conditions = [useState(true), useState(false)];
		const children = [
			div("1"),
			If(conditions[0], () => div("2")),
			If(conditions[1], () => div("3")),
			div("4"),
		];
		const element = div(children);
		conditions[0].set(false);
		conditions[1].set(true);
		expect([...element.childNodes].map((n) => n.textContent)).toEqual([
			"1",
			"3",
			"4",
		]);
	});
});
