import { describe, expect, it } from "vitest";
import { Div, useState } from "../../src";
import { useBinding } from "../../src/data/useBinding";

describe("useBinding", () => {
	it("css, string", () => {
		const child = Div({
			css: {
				background: useBinding("theme", (theme) =>
					theme === "dark" ? "darkblue" : "skyblue",
				),
			},
		});
		Div({ data: { theme: "dark" } }, [child]);
		expect(child.style.background).toBe("darkblue");
	});

	it("css, State", () => {
		const theme = useState("dark");

		const child = Div({
			css: {
				background: useBinding("theme", (theme) =>
					theme === "dark" ? "darkblue" : "skyblue",
				),
			},
		});
		Div({ data: { theme } }, [child]);
		expect(child.style.background).toBe("darkblue");
		theme.set("light");
		expect(child.style.background).toBe("skyblue");
	});

	it("text, State", () => {
		const theme = useState("dark");

		const child = Div({
			text: useBinding("theme", (theme) =>
				theme === "dark" ? "Dark" : "Light",
			),
		});
		Div({ data: { theme } }, [child]);
		expect(child.textContent).toBe("Dark");
		theme.set("light");
		expect(child.textContent).toBe("Light");
	});

	it("attr, State", () => {
		const theme = useState("dark");

		const child = Div({
			attr: {
				class: useBinding("theme", (theme) =>
					theme === "dark" ? "dark-mode" : "light-mode",
				),
			},
		});
		Div({ data: { theme } }, [child]);
		expect(child.classList.toString()).toBe("dark-mode");
		theme.set("light");
		expect(child.classList.toString()).toBe("light-mode");
	});

	it("prop, State", () => {
		const theme = useState("dark");

		const child = Div({
			prop: {
				textContent: useBinding("theme", (theme) =>
					theme === "dark" ? "Dark" : "Light",
				),
			},
		});
		Div({ data: { theme } }, [child]);
		expect(child.textContent).toBe("Dark");
		theme.set("light");
		expect(child.textContent).toBe("Light");
	});

	it("html, State", () => {
		const theme = useState("dark");

		const child = Div({
			html: useBinding("theme", (theme) =>
				theme === "dark" ? `Dark` : `Light`,
			),
		});
		Div({ data: { theme } }, [child]);
		expect(child.innerHTML).toBe("Dark");
		theme.set("light");
		expect(child.innerHTML).toBe("Light");
	});
});
