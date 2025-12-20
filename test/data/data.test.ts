import { assert, describe, it } from "vitest";
import { div } from "../../src";
import { waitForData } from "../../src/data/data";

describe("data", () => {
	it("get data from self", async () => {
		const element = div({
			data: { theme: "dark" },
		});
		const theme = await waitForData(element, "theme");
		assert.equal(theme, "dark");
	});

	it("get data from parent", () => {
		let theme: string | undefined;
		div(
			{
				data: { theme: "dark" },
			},
			[
				div(async (node) => {
					theme = await waitForData(node, "theme");
				}),
			],
		);
		assert.equal(theme, "dark");
	});

	it("get data from grand parent", () => {
		let theme: string | undefined;
		div(
			{
				data: { theme: "dark" },
			},
			[
				div([
					div(async (node) => {
						theme = await waitForData(node, "theme");
					}),
				]),
			],
		);
		assert.equal(theme, "dark");
	});

	it("get data from nearest ancestor", () => {
		let theme: string | undefined;
		div({ data: { theme: "light" } }, [
			div({ data: { theme: "dark" } }, [
				div(async (node) => {
					theme = await waitForData(node, "theme");
				}),
			]),
		]);
		assert.equal(theme, "dark");
	});

	it("ignores callback if data isn't  set", () => {
		let counter = 0;
		div([
			div(async (node) => {
				await waitForData(node, "theme");
				counter++;
			}),
		]);
		assert.equal(counter, 0);
	});

	it("calls callback only once", () => {
		let counter = 0;
		div({ data: { theme: "light" } }, [
			div({ data: { theme: "dark" } }, async (node) => {
				await waitForData(node, "theme");
				counter++;
			}),
		]);
		assert.equal(counter, 1);
	});

	it("supports multiple children", () => {
		let theme1: string | undefined;
		let theme2: string | undefined;
		div({ data: { theme: "dark" } }, [
			div([
				div(async (node) => {
					theme1 = await waitForData(node, "theme");
				}),
				div(async (node) => {
					theme2 = await waitForData(node, "theme");
				}),
			]),
		]);
		assert.equal(theme1, "dark");
		assert.equal(theme2, "dark");
	});

	it("multiple callbacks", () => {
		let counter = 0;
		div({ data: { theme: "dark" } }, [
			div(
				async (node) => {
					await waitForData(node, "theme");
					counter++;
				},
				async (node) => {
					await waitForData(node, "theme");
					counter++;
				},
			),
		]);
		assert.equal(counter, 2);
	});
});
