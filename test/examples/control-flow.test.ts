import { describe, it } from "vitest";
import { button, FlexDiv, input, span } from "../../src/Elements";
import { If } from "../../src/flow/If";
import { Switch } from "../../src/flow/Switch";
import { Modify } from "../../src/Modify";
import { useState } from "../../src/State";

describe("control-flow", () => {
	it("If then", () => {
		const isDisplayed = useState(false);

		Modify(document.body, { html: "" }, [
			input({
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
			span("Check to show rectangle"),
		]);
	});

	it("If else", () => {
		const isDisplayed = useState(false);

		Modify(document.body, { html: "" }, [
			input({
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
			span("Check to show rectangle"),
		]);
	});

	it("Switch", () => {
		const state = useState(
			"triangle" as "triangle" | "rectangle" | "circle" | "pentagon",
		);

		Modify(document.body, { html: "" }, [
			button("Triangle", { on: { click: () => state.set("triangle") } }),
			button("Rectangle", { on: { click: () => state.set("rectangle") } }),
			button("Circle", { on: { click: () => state.set("circle") } }),
			button("Pentagon", { on: { click: () => state.set("pentagon") } }),
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
