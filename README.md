# tagu-tagu

A lightweight helper for vanilla `HTMLElement`, with reactivity. No config, no jsx — only clean javascript.

## `tagu-tagu` is

just a helper for `HTMLElement`:

```html
<script type="module">
import {button} from "https://cdn.jsdelivr.net/npm/tagu-tagu@1.0.1/dist/bundle.min.js";

const myButton = button("Hello!");// `HTMLButtonElement`
document.body.appendChild(myButton);
</script>
```

with reactivity!

```html
<script type="module">
import {button, span, Modify, useState} from "https://cdn.jsdelivr.net/npm/tagu-tagu@1.0.1/dist/bundle.min.js";

const count = useState(4);

function decrementCount() {
    count.set(count.get() - 1);
}
function incrementCount() {
    count.set(count.get() + 1);
}

Modify(document.body, [
    button("-", { on: { click: decrementCount } }),// `HTMLButtonElement`
    span(count),// `HTMLSpanElement`
    button("+", { on: { click: incrementCount } }),// `HTMLButtonElement`
]);
</script>
```

No need to compile. But typescript is supported.

## Features

### Initializers
`tagu-tagu` uses rest parameters. Arguments can be any order.
```typescript
button("Hello!", {css: {background: "blue"}});
button({css: {background: "blue"}}, "Hello!");
```

### `If`

```typescript
import { div, If, input, Modify, span, useState } from "tagu-tagu";

const isVisible = useState(false);

function toggle() {
	isVisible.set(!isVisible.get());
}

Modify(document.body, [
	input({
		attr: { type: "checkbox", checked: isVisible },
		on: { click: toggle },
	}),
	If(isVisible, () =>
		div({
			css: { background: "blue", width: "300px", height: "300px" },
		}),
	),
	span("Check to show rectangle"),
]);
```

### `Switch`

```typescript
import { button, div, Modify, Switch, useState } from "tagu-tagu";

const state = useState(
	"triangle" as "triangle" | "rectangle" | "circle" | "pentagon",
);

Modify(document.body, [
	button("Triangle", { on: { click: () => state.set("triangle") } }),
	button("Rectangle", { on: { click: () => state.set("rectangle") } }),
	button("Circle", { on: { click: () => state.set("circle") } }),
	button("Pentagon", { on: { click: () => state.set("pentagon") } }),
	Switch(
		state,
		[
			{ case: "triangle", show: () => div("▲") },
			{ case: "rectangle", show: () => div("■") },
			{ case: "circle", show: () => div("●") },
		],
		() => div("?"),
	),
]);

```

### `For`

```typescript
import { button, div, For, Modify, useState } from "tagu-tagu";

const numbers = useState([1, 2, 3].map((n) => ({ n })));

function addNumber() {
	const newNumber = numbers.get().length + 1;
	numbers.set([...numbers.get(), { n: newNumber }]);
}
function removeNumber(n: number) {
	numbers.set(numbers.get().filter((value) => value.n !== n));
}

Modify(document.body [
	div([
		For(numbers, (n) =>
			button(`${n.n}`, {
				on: { click: () => removeNumber(n.n) },
			}),
		),
	]),
	button("+", { on: { click: addNumber } }),
]);

```

### Data binding
You can use data of ancestors.

```typescript
import { button, div, Modify, useBinding, useState } from "tagu-tagu";

function Sky() {
	return div("Sky", {
		css: {
			background: useBinding("theme", (theme) =>
				theme === "dark" ? "darkblue" : "skyblue",
			),
		},
	});
}

const theme = useState("dark" as "dark" | "light");

Modify(document.body, [
	div({ data: { theme } }, [
		Sky(),
		button("dark", { on: { click: () => theme.set("dark") } }),
		button("light", { on: { click: () => theme.set("light") } }),
	]),
]);

```

## Seamless migration
Since `tagu-tagu` is just a helper, you can migrate from anywhere.