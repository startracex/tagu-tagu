import { assert, describe, it } from 'vitest';
import {
	SwitchBlockState,
	type SwitchSection,
} from '../../src/flow/SwitchBlockState';
import { useState } from '../../src/State';

describe(SwitchBlockState, () => {
	it('a section', () => {
		const condition1 = useState('hello');
		const sections = [
			{ case: 'hello', show: () => 1 } satisfies SwitchSection<string, number>,
		];
		const state = SwitchBlockState(condition1, sections);
		assert.equal(state.get(), sections[0]);
	});

	it('three sections', () => {
		const sections = ['triangle', 'rectangle', 'circle'].map(
			(c, i) =>
				({ case: c, show: () => i }) satisfies SwitchSection<string, number>,
		);
		const value = useState('rectangle');
		const state = SwitchBlockState(value, sections);
		assert.equal(state.get(), sections[1]);
	});

	it('three sections updated', () => {
		const sections = ['triangle', 'rectangle', 'circle'].map(
			(c, i) =>
				({ case: c, show: () => i }) satisfies SwitchSection<string, number>,
		);
		const value = useState('rectangle');
		const state = SwitchBlockState(value, sections);
		value.set('ellipse');
		assert.equal(state.get(), undefined);
		value.set('circle');
		assert.equal(state.get(), sections[2]);
	});
});
