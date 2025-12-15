import { describe, it } from "vitest";
import { Modify, Svg } from "../../src";

describe(Svg, () => {
	it("polygon", () => {
		const polygon = Svg("polygon", {
			attr: {
				points: "10,50, 50,100 90,50 50,0",
				fill: "blue",
			},
		});
		Modify(document.body, { html: "" }, [
			Svg(
				"svg",
				{
					attr: {
						viewBox: "0 0 100 100",
						width: "100",
						height: "100",
					},
				},
				[polygon],
			),
		]);
	});
});
