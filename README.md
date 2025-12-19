# tagu-tagu

A lightweight helper for vanilla `HTMLElement`. No config, no jsx — only clean javascript.

## `tagu-tagu` is

just a helper for `HTMLElement`:

```javascript
import {button} from "tagu-tagu";

const myButton = button("Click Me!"); // `HTMLButtonElement`
document.body.appendChild(myButton);
```

with reactivity!

```javascript
import {button, span, Modify, useState} from "tagu-tagu";

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
```