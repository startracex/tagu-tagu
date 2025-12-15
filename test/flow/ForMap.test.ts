import { assert, describe, it } from 'vitest';
import { Div, ForMap, useState } from '../../src';

describe(ForMap, () => {
	it('number objs to children', () => {
		const parent = Div();
		const modelArray = [1, 2, 3].map((n) => ({ n })) as {
			n: number;
		}[];
		const modelArrayState = useState(modelArray as readonly { n: number }[]);
		const forMap = new ForMap(modelArrayState, (n) => `${n.n}`);
		forMap.run(parent);
		assert.deepEqual(
			[...parent.childNodes].map((n) => n.textContent),
			['1', '2', '3'],
		);
	});

	it('sort', () => {
		const parent = Div();
		const modelArray = [1, 2, 3].map((n) => ({ n })) as {
			n: number;
		}[];
		const modelArrayState = useState(modelArray as readonly { n: number }[]);
		const forMap = new ForMap(modelArrayState, (n) => `${n.n}`);
		forMap.run(parent);
		modelArrayState.set(modelArray.sort((a, b) => b.n - a.n));
		assert.deepEqual(
			[...parent.childNodes].map((n) => n.textContent),
			['3', '2', '1'],
		);
	});

	it('add item', () => {
		const parent = Div();
		const modelArray = [1, 2, 3].map((n) => ({ n })) as {
			n: number;
		}[];
		const modelArrayState = useState(modelArray as readonly { n: number }[]);
		const forMap = new ForMap(modelArrayState, (n) => `${n.n}`);
		forMap.run(parent);
		const initialChildNodes = [...parent.childNodes];
		modelArray.push({ n: 4 });
		modelArrayState.set(modelArray);
		assert.deepEqual(
			[...parent.childNodes].map((n) => n.textContent),
			['1', '2', '3', '4'],
		);
		assert.deepEqual([...parent.childNodes].slice(0, 3), initialChildNodes);
	});

	it('remove item', () => {
		const parent = Div();
		const modelArray = [1, 2, 3].map((n) => ({ n })) as {
			n: number;
		}[];
		const modelArrayState = useState(modelArray as readonly { n: number }[]);
		const forMap = new ForMap(modelArrayState, (n) => `${n.n}`);
		forMap.run(parent);
		modelArray.splice(1);
		modelArrayState.set(modelArray);
		assert.deepEqual(
			[...parent.childNodes].map((n) => n.textContent),
			['1'],
		);
	});

	it('randomize item', () => {
		const parent = Div();
		const modelArray = [1, 2, 3].map((n) => ({ n })) as {
			n: number;
		}[];
		const modelArrayState = useState(modelArray as readonly { n: number }[]);
		const forMap = new ForMap(modelArrayState, (n) => `${n.n}`);
		forMap.run(parent);
		modelArray.splice(1);
		modelArrayState.set([5, 9, 2].map((n) => ({ n })));
		assert.deepEqual(
			[...parent.childNodes].map((n) => n.textContent),
			['5', '9', '2'],
		);
	});
});
