import { describe, expect, it } from "vitest";
import { Div, If, IfFlow, useState } from "../../src";

describe(IfFlow, () => {
	it("[Div, If, If]", () => {
		const conditions = [useState(true), useState(false)];
		const children = [
			Div(["1"]),
			If(conditions[0], () => Div(["2"])),
			If(conditions[1], () => Div(["3"])),
			Div(["4"]),
		];
		const element = Div(children);
		conditions[0].set(false);
		conditions[1].set(true);
		expect([...element.childNodes].map((n) => n.textContent)).toEqual([
			"1",
			"3",
			"4",
		]);
	});
});
