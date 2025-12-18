import { assert, describe, it } from "vitest";
import { Div } from "../../src";

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

	it("get data from grand parent", () => {
		let theme: string | undefined;
		Div(
			{
				data: { theme: "dark" },
			},
			[
				Div([
					Div({
						data: {
							theme: (value: string) => {
								theme = value;
							},
						},
					}),
				]),
			],
		);
		assert.equal(theme, "dark");
	});

	it("get data from nearest ancestor", () => {
		let theme: string | undefined;
		Div({ data: { theme: "light" } }, [
			Div({ data: { theme: "dark" } }, [
				Div({
					data: {
						theme: (value: string) => {
							theme = value;
						},
					},
				}),
			]),
		]);
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

	it("calls callback only once", () => {
		let counter = 0;
		Div({ data: { theme: "light" } }, [
			Div(
				{ data: { theme: "dark" } },
				{
					data: {
						theme: () => {
							counter++;
						},
					},
				},
			),
		]);
		assert.equal(counter, 1);
	});

	it("supports multiple children", () => {
		let theme1: string | undefined;
		let theme2: string | undefined;
		Div({ data: { theme: "dark" } }, [
			Div([
				Div({
					data: {
						theme: (value: string) => {
							theme1 = value;
						},
					},
				}),
				Div({
					data: {
						theme: (value: string) => {
							theme2 = value;
						},
					},
				}),
			]),
		]);
		assert.equal(theme1, "dark");
		assert.equal(theme2, "dark");
	});
});
