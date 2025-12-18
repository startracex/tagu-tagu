import { describe, it } from "vitest";
import {
	button,
	For,
	Input,
	Modify,
	Select,
	SelectOption,
	useState,
} from "../../src";

describe(Select, () => {
	it("<option> simplest", () => {
		Modify(document.body, { html: "" }, [
			Select([
				SelectOption(["Apple"]),
				SelectOption(["Orange"]),
				SelectOption(["Banana"]),
			]),
		]);
	});

	it("<option> with For", () => {
		const items = useState(["Apple", "Orange", "Banana"]);
		const newValue = useState("Strawberry");
		const selectedValue = useState("Orange");

		function addItem() {
			items.set([...items.get(), newValue.get()]);
			selectedValue.set(newValue.get());
			newValue.set("");
		}
		function removeItem() {
			items.set(items.get().filter((item) => item !== selectedValue.get()));
			selectedValue.set("");
		}
		function updateSelectedValue(e: Event) {
			selectedValue.set((e.target as HTMLSelectElement).value);
		}
		function updateValue(e: Event) {
			const value = (e.target as HTMLInputElement).value;
			newValue.set(value);
		}

		Modify(document.body, { html: "" }, [
			Select(
				[
					SelectOption({ prop: { value: "" } }, ["-- choose an item --"]),
					For(items, (item) => SelectOption([item])),
				],
				{
					prop: { value: selectedValue },
					on: { change: updateSelectedValue },
				},
			),
			Input({
				attr: { value: newValue },
				on: { input: updateValue },
			}),
			button("+", { on: { click: addItem } }),
			button("✖", { on: { click: removeItem } }),
		]);
	});
});
