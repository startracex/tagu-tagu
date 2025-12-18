import { describe, it } from "vitest";
import { button, input, Modify, useState } from "../../src";

describe(input, () => {
	it("checkbox", () => {
		Modify(document.body, { html: "" }, [
			input({ attr: { type: "checkbox" } }),
		]);
	});
	it("two checkboxes", () => {
		const isChedked = useState(false);

		const onClick = () => {
			isChedked.set(!isChedked.get());
		};

		Modify(document.body, { html: "" }, [
			input({
				attr: {
					type: "checkbox",
					checked: isChedked,
				},
				on: { click: onClick },
			}),
			input({
				attr: {
					type: "checkbox",
					checked: isChedked,
				},
				on: { click: onClick },
			}),
		]);
	});

	it("two textboxes", () => {
		const value = useState("Hello");

		function updateValue(e: Event) {
			const newValue = (e.target as HTMLInputElement).value;
			value.set(newValue);
		}

		Modify(document.body, { html: "" }, [
			input({
				attr: { value },
				on: { input: updateValue },
			}),
			input({
				attr: { value },
				on: { input: updateValue },
			}),
		]);
	});

	it("clear textbox", () => {
		const value = useState("Hello");

		function updateValue(e: Event) {
			const newValue = (e.target as HTMLInputElement).value;
			value.set(newValue);
		}
		function clearValue() {
			value.set("");
		}

		Modify(document.body, { html: "" }, [
			input({
				attr: { value },
				on: { input: updateValue },
			}),
			button("clear", {
				on: { click: clearValue },
			}),
		]);
	});
});
