import { describe, it } from "vitest";
import { div, Modify, useState } from "../../src";

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

	it("animate: {}", () => {
		Modify(document.body, { html: "" }, [
			div(
				"Hello!",
				{ css: { background: "blue" } },
				{ css: { background: "lime" }, animate: {} },
				{ text: "Animation Finished" },
			),
		]);
	});
	it("animate: {duration: 1000}", () => {
		Modify(document.body, { html: "" }, [
			div(
				"Hello!",
				{ css: { background: "blue" } },
				{ css: { background: "lime" }, animate: { duration: 1000 } },
				{ text: "Animation Finished" },
			),
		]);
	});

	it(`animate: {easing: "swing"}`, () => {
		Modify(document.body, { html: "" }, [
			div(
				"Hello!",
				{ css: { left: "0px", background: "blue", position: "absolute" } },
				{
					css: { left: "100px" },
					animate: { duration: 1000, easing: "swing" },
				},
				{ text: "Animation Finished" },
			),
		]);
	});
});
