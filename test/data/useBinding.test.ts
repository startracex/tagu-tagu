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
});
