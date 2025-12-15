import { type State, useState } from '../State';

export type SwitchSection<TCase, TElement = Element> = {
	case: TCase;
	show: () => TElement;
};

export function SwitchBlockState<TCase, TElement = Element>(
	value: State<TCase>,
	sections: SwitchSection<TCase, TElement>[],
) {
	const result = useState<SwitchSection<TCase, TElement> | undefined>(
		undefined,
	);

	const update = () => {
		let activated: SwitchSection<TCase, TElement> | undefined;

		for (const section of sections) {
			if (value.get() === section.case) {
				activated = section;
			}
		}
		result.set(activated);
	};

	value.on('change', update);

	update();
	return result;
}
