import { assert, describe, it } from "vitest";
import { div, ModifyAsync } from "../../src";
import { sleep } from "../../src/sleep";

describe("animate", () => {
	it("$", async () => {
		const log = [] as string[];
		const element = div([
			div({ attr: { id: "a" } }),
			div({ attr: { id: "b" } }),
		]);
		await ModifyAsync(
			element,
			{
				$: {
					"#a": async () => {
						await sleep(1);
						log.push("a");
					},
					"#b": () => {
						log.push("b");
					},
				},
			},
			() => {
				log.push("finished");
			},
		);
		assert.deepEqual(log, ["b", "a", "finished"]);
	});

	it("$$", async () => {
		const log = [] as string[];
		const element = div([
			div({ attr: { id: "a" } }),
			div({ attr: { id: "b" } }),
		]);
		await ModifyAsync(
			element,
			{
				$$: {
					"#a": async () => {
						await sleep(1);
						log.push("a");
					},
					"#b": () => {
						log.push("b");
					},
				},
			},
			() => {
				log.push("finished");
			},
		);
		assert.deepEqual(log, ["b", "a", "finished"]);
	});
});
