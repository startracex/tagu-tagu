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
[JSFiddle](https://jsfiddle.net/do_the_simplest/3bysqr7t/14/)

No need to compile. But typescript is supported.

## Examples

### Initializers
Elements are initialized by rest parameters. Arguments can be any order.

```typescript
button("Hello!", {css: {background: "blue"}});
button({css: {background: "blue"}}, "Hello!");
```

#### text initializer

```typescript
import { div } from "tagu-tagu";

function SimpleTextExample() {
	return div("Hello");
}

document.body.appendChild(SimpleTextExample());
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/q4kzphbr/2/)

or

```typescript
import { div } from "tagu-tagu";

// Element: textContent
function TextExample() {
	return div({ text: "Hello" });
}

document.body.appendChild(TextExample());
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/yqda3rhp/9/)

#### Children initializer


```typescript
import { button, div, h1 } from "tagu-tagu";

// Element: append
function ChildrenExample() {
	return div(["Hello", button("World!"), "HELLO", h1("WORLD!")]);
}

document.body.appendChild(ChildrenExample());

```
[JSFiddle](https://jsfiddle.net/do_the_simplest/hx9mn4rg/1/)


#### `html` initializer
```typescript
import { div } from "tagu-tagu";

// Element: innerHTML
function HtmlExample() {
	return div({ html: `<button>Hello World!</button>` });
}

document.body.appendChild(HtmlExample());

```
[JSFiddle](https://jsfiddle.net/do_the_simplest/6p9jh45L/2/)

#### `css` initializer

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
[JSFiddle](https://jsfiddle.net/do_the_simplest/mfLutvnc/1/)

#### `attr` initializer

```typescript
import { input } from "tagu-tagu";

// Element: setAttribute
function AttrExample() {
	return input({
		attr: { type: "color" },
	});
}

document.body.appendChild(AttrExample());
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/r8a423pw/1/)

#### `prop` initializer

```typescript
import { option, select } from "tagu-tagu";

// Javascript properties
function PropExample() {
	return select([option("One"), option("Two"), option("Three")], {
		prop: { selectedIndex: 1 },
	});
}

document.body.appendChild(PropExample());
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/mc38ksqw/2/)

#### `on` initializer
```typescript
import { button } from "tagu-tagu";

// Element: addEventListener
function OnExample() {
	return button("Click Me", { on: { click: () => alert("Hello!") } });
}

document.body.appendChild(OnExample());
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/Lsjmw263/)

#### `data` initializer

```typescript
import { div, waitForData } from "tagu-tagu";

function DataExample() {
	return div({ data: { "my-data-key": "Hello World!" } });
}

const element = DataExample();
console.log(await waitForData(element, "my-data-key")); // Hello World!
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/9cLtyzkm/1/)

```typescript
import { div, Modify, waitForData } from "tagu-tagu";

/**
 * Node can get data from ancestors.
 * Node can't get data from descendants.
 * */
function DataFromParentExample() {
	const parent = div();
	const element = div({ data: { "my-data-key": "Hello World!" } });
	const child = div();
	waitForData(parent, "my-data-key").then(() => {
		parent.textContent = "Parent"; // never
	});
	waitForData(child, "my-data-key").then(() => {
		child.textContent = "Child"; // displayed
	});
	return Modify(parent, [Modify(element, [child])]);
}

document.body.appendChild(DataFromParentExample());
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/eh7bdrvL/3/)

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
[JSFiddle](https://jsfiddle.net/do_the_simplest/o87nw6zL/15/)


#### `$` initializer
```html
<form>
    <div>Name: <input id="name"></div>
    <div>Age: <input id="age"></div>
    <button id="submit">Submit</button>
</form>
<script type="module" src="index.ts"></script>
```
```typescript
import { Modify, style } from "tagu-tagu";

// Element: querySelector
function $Example() {
	Modify("form", {
		$: {
			"#name": { prop: { defaultValue: "Einstein" } },
			"#age": { attr: { type: "number" }, prop: { defaultValue: 26 } },
			"#submit": [
				style({
					"#submit": {
						background: "blue",
						color: "white",
						border: "none",
						"border-radius": "10px",
					},
					"#submit:hover": {
						background: "skyblue",
					},
				}),
			],
		},
	});
}

$Example();
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/b8roj7wx/1/)

#### `$$` initializer
```html
<meta charset="utf-8">
<div>
    <h1>Unfertilized Eggs</h1>
    <button>🥚</button>
    <button>🥚</button>
    <button>🥚</button>
    <button>🥚</button>
    <button>🥚</button>
</div>
<div id="fertilized">
    <h1>Click!</h1>
    <button>🥚</button>
    <button>🥚</button>
    <button>🥚</button>
    <button>🥚</button>
    <button>🥚</button>
</div>
<script type="module" src="index.ts"></script>
```
```typescript
import { Modify } from "tagu-tagu";

// Element: querySelectorAll
function $$Example() {
	Modify("#fertilized", {
		$$: {
			button: {
				on: {
					click: (e) => {
						(e.target as HTMLButtonElement).textContent = "🐣";
					},
				},
			},
		},
	});
}

$$Example();
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/gqe5378t/1/)

or you can use `ModifyAll`

```typescript
import { ModifyAll } from "tagu-tagu";

function ModifyAllExample() {
	ModifyAll("#fertilized button", {
		on: {
			click: (e) => {
				(e.target as HTMLButtonElement).textContent = "🐣";
			},
		},
	});
}

ModifyAllExample();
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/fn10gzp4/6/)

#### Callback initializer
```typescript
import { button, div } from "tagu-tagu";

function InitializerCallbackExample() {
	return div([
		div([
			div([
				button("Deep", (button) =>
					console.log("debug:", button, "is created!"),
				),
			]),
		]),
	]);
}

document.body.appendChild(InitializerCallbackExample());
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/tfj8uqa7/3/)

#### Animation
[`animate` initializer](./docs/animate.md)

### `State`
```typescript
import { button, div, useState } from "tagu-tagu";

function SimpleStateExample() {
	const count = useState(0);

	function incrementCount() {
		count.set(count.get() + 1);
	}

	return div([div(count), button("+", { on: { click: incrementCount } })]);
}

document.body.appendChild(SimpleStateExample());
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/j3948zpo/1/)

```typescript
import { button, div, useState, useComputed } from "tagu-tagu";

function ComputedExample() {
	const count = useState(0);

	function incrementCount() {
		count.set(count.get() + 1);
	}

	return div([
		div(useComputed(() => (count.get() ? count.get() : "Zero"))),
		button("+", { on: { click: incrementCount } }),
	]);
}

document.body.appendChild(ComputedExample());
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/by934m81/7/)

```typescript
import { button, div, useState, useComputed } from "tagu-tagu";

function TwoComputedSignalsExample() {
	const count = useState(0);

	function incrementCount() {
		count.set(count.get() + 1);
	}

	return div([
		div(
			useComputed(() => (count.get() ? count.get() : "Zero")),
			{
				css: {
					color: useComputed(() => (count.get() % 2 === 0 ? "blue" : "tan")),
				},
			},
		),
		button("+", { on: { click: incrementCount } }),
	]);
}

document.body.appendChild(TwoComputedSignalsStateExample());
```
[JSFiddle](https://jsfiddle.net/do_the_simplest/8hsuc5pn/5/)

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
			attr: { type: "checkbox" },
			prop: { checked: isVisible },
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
[JSFiddle](https://jsfiddle.net/do_the_simplest/bxuqsh1d/21/)

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
[JSFiddle](https://jsfiddle.net/do_the_simplest/vw8hrz1t/14/)

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
[JSFiddle](https://jsfiddle.net/do_the_simplest/soLa9v6t/12/)

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
[JSFiddle](https://jsfiddle.net/do_the_simplest/9u6oz2bc/6/)

## Seamless migration
Since `tagu-tagu` is just a helper, you can migrate from anywhere.