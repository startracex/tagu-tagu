import { assert, describe, it } from "vitest";
import { div, sleep, span } from "../../src";
import { Await } from "../../src/flow/Await";

describe(Await, () => {
	it("Loading", () => {
		async function func() {
			await sleep(1);
		}
		const log = [] as string[];
		div([
			Await(func(), {
				pending: () =>
					span(() => {
						log.push("Loading...");
					}),
			}),
		]);
		assert.deepEqual(log, ["Loading..."]);
	});
});
