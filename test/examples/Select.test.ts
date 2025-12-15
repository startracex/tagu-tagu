import { describe, it } from "vitest";
import {
	Button,
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
				{
					prop: { value: selectedValue },
					on: { change: updateSelectedValue },
				},
				[
					SelectOption({ prop: { value: "" } }, ["-- choose an item --"]),
					For(items, (item) => SelectOption([item])),
				],
			),
			Input({
				attr: { value: newValue },
				on: { input: updateValue },
			}),
			Button(["+"], { on: { click: addItem } }),
			Button(["✖"], { on: { click: removeItem } }),
		]);
	});
});
