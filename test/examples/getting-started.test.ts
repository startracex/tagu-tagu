import { describe, it } from "vitest";
import { Button, FlexDiv, Span, Style } from "../../src/Elements";
import { Modify } from "../../src/Modify";
import { FromStates, useState } from "../../src/State";

describe("getting started", () => {
	it("add button", () => {
		Modify(document.body, { html: "" }, [Button(["Click me!"])]);
	});
	it("counter", () => {
		const count = useState(4);

		function decrementCount() {
			count.set(count.get() - 1);
		}
		function incrementCount() {
			count.set(count.get() + 1);
		}

		Modify(document.body, { html: "" }, [
			Button(["-"], { on: { click: decrementCount } }),
			Span([count]),
			Button(["+"], { on: { click: incrementCount } }),
		]);
	});
	it("State can be assigned as css value", () => {
		const background = useState("green" as "red" | "green" | "blue");

		Modify(document.body, { html: "" }, [
			FlexDiv({
				css: { width: "300px", height: "300px", background: background },
			}),
			Button(["red"], { on: { click: () => background.set("red") } }),
			Button(["green"], { on: { click: () => background.set("green") } }),
			Button(["blue"], { on: { click: () => background.set("blue") } }),
		]);
	});

	it("State can be assigned as attr value", () => {
		const background = useState("small" as "small" | "large");

		Modify(document.body, { html: "" }, [
			Button(["small"], { on: { click: () => background.set("small") } }),
			Button(["large"], { on: { click: () => background.set("large") } }),
			FlexDiv(
				{
					attr: {
						class: background,
					},
				},
				[
					Style({
						".small": {
							width: "100px",
							height: "100px",
							background: "blue",
						},
						".large": {
							width: "300px",
							height: "300px",
							background: "skyblue",
						},
					}),
				],
			),
		]);
	});

	it("State can be assigned as text value", () => {
		const count = useState(0);

		function incrementCount() {
			count.set(count.get() + 1);
		}
		function decrementCount() {
			count.set(count.get() - 1);
		}

		Modify(document.body, { html: "" }, [
			FlexDiv({
				text: count,
			}),
			Button(["-"], { on: { click: decrementCount } }),
			Button(["+"], { on: { click: incrementCount } }),
		]);
	});

	it("State can be assigned as html value", () => {
		const count = useState(0);

		function incrementCount() {
			count.set(count.get() + 1);
		}
		function decrementCount() {
			count.set(count.get() - 1);
		}

		Modify(document.body, { html: "" }, [
			FlexDiv({
				html: FromStates([count], () => `${count.get()}`),
			}),
			Button(["-"], { on: { click: decrementCount } }),
			Button(["+"], { on: { click: incrementCount } }),
		]);
	});

	it("Modify by selector", () => {
		Modify(document.body, { html: "" }, [FlexDiv({ attr: { id: "my-div" } })]);
		Modify("#my-div", {
			css: { background: "blue", width: "100px", height: "100px" },
		});
	});
});
