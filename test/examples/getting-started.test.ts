import { describe, it } from "vitest";
import { button, div, span, style } from "../../src/Elements";
import { Modify } from "../../src/Modify";
import { useComputed, useState } from "../../src/State";

describe("getting started", () => {
	it("add button", () => {
		Modify(document.body, { html: "" }, [button("Click me!")]);
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
			button("-", { on: { click: decrementCount } }),
			span(count),
			button("+", { on: { click: incrementCount } }),
		]);
	});
	it("State can be assigned as css value", () => {
		const background = useState("green" as "red" | "green" | "blue");

		Modify(document.body, { html: "" }, [
			div({
				css: { width: "300px", height: "300px", background: background },
			}),
			button("red", { on: { click: () => background.set("red") } }),
			button("green", { on: { click: () => background.set("green") } }),
			button("blue", { on: { click: () => background.set("blue") } }),
		]);
	});

	it("State can be assigned as attr value", () => {
		const background = useState("small" as "small" | "large");

		Modify(document.body, { html: "" }, [
			button("small", { on: { click: () => background.set("small") } }),
			button("large", { on: { click: () => background.set("large") } }),
			div(
				{
					attr: {
						class: background,
					},
				},
				[
					style({
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
			div({
				text: count,
			}),
			button("-", { on: { click: decrementCount } }),
			button("+", { on: { click: incrementCount } }),
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
			div({
				html: useComputed([count], () => `${count.get()}`),
			}),
			button("-", { on: { click: decrementCount } }),
			button("+", { on: { click: incrementCount } }),
		]);
	});

	it("Modify by selector", () => {
		Modify(document.body, { html: "" }, [div({ attr: { id: "my-div" } })]);
		Modify("#my-div", {
			css: { background: "blue", width: "100px", height: "100px" },
		});
	});
});
