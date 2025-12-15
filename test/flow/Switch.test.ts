import { assert, describe, it } from "vitest";
import { Div, Switch, useState } from "../../src";

describe(Switch, () => {
	it("no element", () => {
		const value = useState(0);
		const element = Div([Switch(value, [{ case: -1, show: () => Div() }])]);
		assert(!element.childNodes[0]);
	});
	it("show element", () => {
		const value = useState(0);
		const element = Div([Switch(value, [{ case: 0, show: () => Div() }])]);
		assert(element.childNodes[0]);
	});
});
