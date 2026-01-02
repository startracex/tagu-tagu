import { assert, describe, it } from "vitest";
import {
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	Modify,
	p,
	pre,
	script,
	section,
	textarea,
} from "../../src";

describe("elements", () => {
	it("<h1> - <h6>, <p>, <section>, <textarea>", () => {
		Modify(document.body, { html: "" }, [
			h1("Hello <h1>"),
			h2("Hello <h2>"),
			h3("Hello <h3>"),
			h4("Hello <h4>"),
			h5("Hello <h5>"),
			h6("Hello <h6>"),
			p("Hello! It's <p>"),
			section([p("<p> in <section>"), p("2nd <p>")]),
			textarea(),
			pre(["This is <pre>"]),
		]);
	});

	it(`<script>`, () => {
		assert.equal(script().tagName, "SCRIPT");
	});
});
