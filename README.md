# tagu-tagu

A lightweight helper for vanilla `HTMLElement`, with reactivity. No config, no jsx — only clean javascript.

## `tagu-tagu` is

just a helper for `HTMLElement`:

```javascript
import {button} from "https://cdn.jsdelivr.net/npm/tagu-tagu@1.0.1/dist/bundle.min.js";

const myButton = button("Hello!");// `HTMLButtonElement`
document.body.appendChild(myButton);
```

with reactivity!

```javascript
import {button, span, div, useState} from "https://cdn.jsdelivr.net/npm/tagu-tagu@1.0.4/dist/bundle.min.js";

function CounterExample(){
    const count = useState(4);

    function decrementCount() {
        count.set(count.get() - 1);
    }
    function incrementCount() {
        count.set(count.get() + 1);
    }

    return div([
        button("-", { on: { click: decrementCount } }),// `HTMLButtonElement`
        span(count),// `HTMLSpanElement`
        button("+", { on: { click: incrementCount } }),// `HTMLButtonElement`
    ])
}

document.body.appendChild(CounterExample());
```

No need to compile. But typescript is supported.

## Examples
See examples [here](https://dothesimplest.github.io/tagu-tagu/).

## Features

### Initializers
`tagu-tagu` uses rest parameters. Arguments can be any order.
```typescript
button("Hello!", {css: {background: "blue"}});
button({css: {background: "blue"}}, "Hello!");
```

#### Modify existing element
You can use initializers for existing element.

```typescript
import { Modify } from "tagu-tagu";

Modify(document.body, {
	text: "💣",
	css: {
		background: "skyblue",
	},
	on: {
		click: () => {
			document.body.textContent = "💥";
		},
	},
});

```

#### `html` initializer
[JSFiddle](https://jsfiddle.net/do_the_simplest/6p9jh45L/2/)
```typescript
import { div } from "tagu-tagu";

// Element: innerHTML
function HtmlExample() {
	return div({ html: `<button>Hello World!</button>` });
}

document.body.appendChild(HtmlExample());

```

#### `css` initializer
[JSFiddle](https://jsfiddle.net/do_the_simplest/mfLutvnc/1/)

```typescript
import { button } from "tagu-tagu";

// element.style.setProperty
function CssExample() {
	return button({
		css: { width: "300px", height: "300px" },
	});
}

document.body.appendChild(CssExample());
```

### `If`

```typescript
import { div, If, input, span, useState } from "tagu-tagu";

function IfExample() {
	const isVisible = useState(false);

	function toggle() {
		isVisible.set(!isVisible.get());
	}

	return div([
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
}

document.body.appendChild(IfExample());

```

### `Switch`

```typescript
import { button, div, Switch, useState } from "tagu-tagu";

function SwitchExample() {
	const state = useState("triangle");

	return div([
		button("Triangle", { on: { click: () => state.set("triangle") } }),
		button("Rectangle", { on: { click: () => state.set("rectangle") } }),
		button("Circle", { on: { click: () => state.set("circle") } }),
		button("Pentagon", { on: { click: () => state.set("pentagon") } }),
		Switch(
			state,
			{
				triangle: () => div("▲"),
				rectangle: () => div("■"),
				circle: () => div("●"),
			},
			() => div("?"),
		),
	]);
}

document.body.appendChild(SwitchExample());

```

### `For`

```typescript
import { button, div, For, useState } from "tagu-tagu";

function ForExample() {
	const numbers = useState([1, 2, 3].map((n) => ({ n })));
	let id = numbers.get().length;

	function addNumber() {
		id++;
		numbers.set([...numbers.get(), { n: id }]);
	}
	function removeNumber(n: number) {
		numbers.set(numbers.get().filter((value) => value.n !== n));
	}

	return div([
		div([
			For(numbers, (n) =>
				button(`${n.n}`, {
					on: { click: () => removeNumber(n.n) },
				}),
			),
		]),
		button("+", { on: { click: addNumber } }),
	]);
}

document.body.appendChild(ForExample());

```

### Data binding
You can use data of ancestors.

```typescript
import { button, div, useBinding, useState } from "tagu-tagu";

function Sky() {
	return div("Sky", {
		css: {
			background: useBinding("theme", (theme) =>
				theme === "dark" ? "darkblue" : "skyblue",
			),
		},
	});
}

function DataBindingExample() {
	const theme = useState("dark" as "dark" | "light");

	return div({ data: { theme } }, [
		Sky(),
		button("dark", { on: { click: () => theme.set("dark") } }),
		button("light", { on: { click: () => theme.set("light") } }),
	]);
}

document.body.appendChild(DataBindingExample());

```

## Seamless migration
Since `tagu-tagu` is just a helper, you can migrate from anywhere.