import { describe, it } from "vitest";
import { h1, h2, h3, h4, h5, h6, Modify, p } from "../../src";

describe("elements", () => {
	it("<h1> - <h6>, <p>", () => {
		Modify(document.body, { html: "" }, [
			h1("Hello <h1>"),
			h2("Hello <h2>"),
			h3("Hello <h3>"),
			h4("Hello <h4>"),
			h5("Hello <h5>"),
			h6("Hello <h6>"),
			p("Hello! It's <p>"),
		]);
	});
});
