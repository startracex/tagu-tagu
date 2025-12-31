import { describe, it } from "vitest";
import { div, Modify, ModifyAsync, useState } from "../../src";
import { sleep } from "../../src/sleep";

describe("animate", () => {
	it("simple duration", () => {
		Modify(document.body, { html: "" }, [
			div(
				"Hello!",
				{ css: { background: "blue" } },
				{ css: { background: "lime" }, animate: 1000 },
				{ text: "Animation Finished" },
			),
		]);
	});

	it("state", () => {
		Modify(document.body, { html: "" }, [
			div(
				"Hello!",
				{ css: { background: "blue" } },
				{ css: { background: useState("lime") }, animate: 1000 },
				{ text: "Animation Finished" },
			),
		]);
	});

	it("{}", () => {
		Modify(document.body, { html: "" }, [
			div(
				"Hello!",
				{ css: { background: "blue" } },
				{ css: { background: "lime" }, animate: {} },
				{ text: "Animation Finished" },
			),
		]);
	});
	it("{duration: 1000}", () => {
		Modify(document.body, { html: "" }, [
			div(
				"Hello!",
				{ css: { background: "blue" } },
				{ css: { background: "lime" }, animate: { duration: 1000 } },
				{ text: "Animation Finished" },
			),
		]);
	});

	it(`{ easing: undefined } is "swing"`, () => {
		Modify(document.body, { html: "" }, [
			div(
				"Hello!",
				{ css: { left: "0px", background: "blue", position: "absolute" } },
				{
					css: { left: "100px" },
					animate: { duration: 1000 },
				},
			),
		]);
	});

	it(`{ easing: "linear" }`, () => {
		Modify(document.body, { html: "" }, [
			div(
				"Hello!",
				{ css: { left: "0px", background: "blue", position: "absolute" } },
				{
					css: { left: "100px" },
					animate: { duration: 1000, easing: "linear" },
				},
			),
		]);
	});

	it(`async callback`, () => {
		Modify(document.body, { html: "" }, [
			div(
				"Hello!",
				async () => {
					await sleep(1000);
				},
				{ text: "Completed" },
			),
		]);
	});
});

describe(ModifyAsync, () => {
	it(`animates multiple styles`, () => {
		Modify(document.body, { html: "" }, [
			div(
				"Hello!",
				{
					css: {
						width: "100px",
						height: "100px",
						background: "blue",
						position: "absolute",
						color: "white",
					},
				},
				async (e) => {
					await Promise.all([
						ModifyAsync(e, {
							css: { width: "200px" },
							animate: { duration: 1000 },
						}),

						ModifyAsync(e, {
							css: { height: "200px" },
							animate: { duration: 500 },
						}),
					]);
				},
				{
					text: "Finished!",
				},
			),
		]);
	});
});
