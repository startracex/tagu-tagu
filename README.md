# tagu-tagu

A lightweight helper for vanilla `HTMLElement`. No config, no jsx — only clean javascript.

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