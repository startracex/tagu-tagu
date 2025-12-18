import { assert, describe, it } from "vitest";
import { Div, If, Switch, useState } from "../../src";

describe(`data with ${If.name}`, () => {
	it(`calls callbacks when condition becomes true`, () => {
		let theme1: string | undefined;
		const condition = useState(false);
		Div({ data: { theme: "dark" } }, [
			Div([
				If(condition, () =>
					Div({
						data: {
							theme: (value: string) => {
								theme1 = value;
							},
						},
					}),
				),
			]),
		]);
		assert.equal(theme1, undefined);
		condition.set(true);
		assert.equal(theme1, "dark");
	});

	it(`calls callbacks for \`else\` when condition becomes false`, () => {
		let theme1: string | undefined;
		const condition = useState(true);
		Div({ data: { theme: "dark" } }, [
			Div([
				If(
					condition,
					() => Div(),
					() =>
						Div({
							data: {
								theme: (value: string) => {
									theme1 = value;
								},
							},
						}),
				),
			]),
		]);
		assert.equal(theme1, undefined);
		condition.set(false);
		assert.equal(theme1, "dark");
	});
});

describe(`data with ${Switch.name}`, () => {
	it(`calls callbacks when value matches`, () => {
		let theme: string | undefined;
		const condition = useState(0);
		Div({ data: { theme: "dark" } }, [
			Div([
				Switch(condition, [
					{
						case: 2,
						show: () =>
							Div({
								data: {
									theme: (value: string) => {
										theme = value;
									},
								},
							}),
					},
				]),
			]),
		]);
		assert.equal(theme, undefined);
		condition.set(2);
		assert.equal(theme, "dark");
	});

	it(`calls callbacks in default when value is in default`, () => {
		let theme: string | undefined;
		let theme2: string | undefined;
		const condition = useState(2);
		Div({ data: { theme: "dark" } }, [
			Div([
				Switch(
					condition,
					[
						{
							case: 2,
							show: () =>
								Div({
									data: {
										theme: (value: string) => {
											theme = value;
										},
									},
								}),
						},
					],
					() =>
						Div({
							data: {
								theme: (value: string) => {
									theme2 = value;
								},
							},
						}),
				),
			]),
		]);

		assert.equal(theme, "dark");
		assert.equal(theme2, undefined);
		condition.set(0);
		assert.equal(theme2, "dark");
	});
});
