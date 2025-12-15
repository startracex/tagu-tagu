import { describe, it } from 'vitest';
import { Button, Input, Modify, useState } from '../../src';

describe(Input, () => {
	it('checkbox', () => {
		Modify(document.body, { html: '' }, [
			Input({ attr: { type: 'checkbox' } }),
		]);
	});
	it('two checkboxes', () => {
		const isChedked = useState(false);

		const onClick = () => {
			isChedked.set(!isChedked.get());
		};

		Modify(document.body, { html: '' }, [
			Input({
				attr: {
					type: 'checkbox',
					checked: isChedked,
				},
				on: { click: onClick },
			}),
			Input({
				attr: {
					type: 'checkbox',
					checked: isChedked,
				},
				on: { click: onClick },
			}),
		]);
	});

	it('two textboxes', () => {
		const value = useState('Hello');

		function updateValue(e: Event) {
			const newValue = (e.target as HTMLInputElement).value;
			value.set(newValue);
		}

		Modify(document.body, { html: '' }, [
			Input({
				attr: { value },
				on: { input: updateValue },
			}),
			Input({
				attr: { value },
				on: { input: updateValue },
			}),
		]);
	});

	it('clear textbox', () => {
		const value = useState('Hello');

		function updateValue(e: Event) {
			const newValue = (e.target as HTMLInputElement).value;
			value.set(newValue);
		}
		function clearValue() {
			value.set('');
		}

		Modify(document.body, { html: '' }, [
			Input({
				attr: { value },
				on: { input: updateValue },
			}),
			Button(['clear'], {
				on: { click: clearValue },
			}),
		]);
	});
});
