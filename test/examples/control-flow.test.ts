import { describe, it } from "vitest";
import { Button, FlexDiv, Input, Span } from "../../src/Elements";
import { If } from "../../src/flow/If";
import { Switch } from "../../src/flow/Switch";
import { Modify } from "../../src/Modify";
import { useState } from "../../src/State";

describe("control-flow", () => {
	it("If then", () => {
		const isDisplayed = useState(false);

		Modify(document.body, { html: "" }, [
			Input({
				attr: { type: "checkbox", checked: isDisplayed },
				on: {
					click: () => {
						isDisplayed.set(!isDisplayed.get());
					},
				},
			}),
			If(isDisplayed, () =>
				FlexDiv({
					css: { background: "blue", width: "300px", height: "300px" },
				}),
			),
			Span("Check to show rectangle"),
		]);
	});

	it("If else", () => {
		const isDisplayed = useState(false);

		Modify(document.body, { html: "" }, [
			Input({
				attr: { type: "checkbox", checked: isDisplayed },
				on: {
					click: () => {
						isDisplayed.set(!isDisplayed.get());
					},
				},
			}),
			If(
				isDisplayed,
				() =>
					FlexDiv({
						css: { background: "blue", width: "300px", height: "300px" },
					}),
				() => FlexDiv("No rectangle"),
			),
			Span("Check to show rectangle"),
		]);
	});

	it("Switch", () => {
		const state = useState(
			"triangle" as "triangle" | "rectangle" | "circle" | "pentagon",
		);

		Modify(document.body, { html: "" }, [
			Button("Triangle", { on: { click: () => state.set("triangle") } }),
			Button("Rectangle", { on: { click: () => state.set("rectangle") } }),
			Button("Circle", { on: { click: () => state.set("circle") } }),
			Button("Pentagon", { on: { click: () => state.set("pentagon") } }),
			Switch(
				state,
				[
					{ case: "triangle", show: () => FlexDiv("▲") },
					{ case: "rectangle", show: () => FlexDiv("■") },
					{ case: "circle", show: () => FlexDiv("●") },
				],
				() => FlexDiv("?"),
			),
		]);
	});
});
