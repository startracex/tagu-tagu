import { assert, describe, it } from "vitest";
import { $, $$, button, Modify, ModifyAll, option, select } from "../src";

describe(Modify, () => {
	it("text", () => {
		$(document.body, {
			text: "Hello!",
		});
		assert.equal(document.body.textContent, "Hello!");
	});
	it("attr", () => {
		function AttrExample() {
			return select([option("One"), option("Two"), option("Three")], {
				prop: { selectedIndex: 1 },
			});
		}
		const selectElement = AttrExample();
		assert.equal(selectElement.selectedIndex, 1);
	});
});

describe(ModifyAll, () => {
	it("text", () => {
		$(document.body, { html: "" }, [button(), button(), button()]);
		$$("button", { text: "my-button" });
		assert.deepEqual(
			[...document.body.children].map((b) => b.textContent),
			["my-button", "my-button", "my-button"],
		);
	});
});
