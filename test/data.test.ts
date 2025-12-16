import { assert, describe, it } from "vitest";
import { Div } from "../src";

describe("data", () => {
	it("get data from self", () => {
		let theme: string | undefined;
		Div(
			{
				data: { theme: "dark" },
			},
			{
				data: {
					theme: (value: string) => {
						theme = value;
					},
				},
			},
		);
		assert.equal(theme, "dark");
	});

	it("get data from parent", () => {
		let theme: string | undefined;
		Div(
			{
				data: { theme: "dark" },
			},
			[
				Div({
					data: {
						theme: (value: string) => {
							theme = value;
						},
					},
				}),
			],
		);
		assert.equal(theme, "dark");
	});

	it("ignores callback if data isn't  set", () => {
		let counter = 0;
		Div([
			Div({
				data: {
					theme: () => {
						counter++;
					},
				},
			}),
		]);
		assert.equal(counter, 0);
	});
});
