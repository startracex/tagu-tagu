export type DataCallback = (data: any) => void;

export class NodeData {
	node2Data = new WeakMap<Node, Record<string, any>>();

	setCallbackRecord(
		element: Element,
		callbackRecord: Record<string, DataCallback[]> | undefined,
	) {
		if (callbackRecord) {
			this.node2DescendantCallbacks.set(element, { ...callbackRecord });
		}

		const dataRecord = this.node2Data.get(element);
		for (const key in dataRecord) {
			if (key in dataRecord) {
				for (const callback of callbackRecord?.[key] ?? []) {
					callback(dataRecord[key]);
				}
			}
		}
	}

	setDataRecord(element: Element, dataRecord: Record<string, any> | undefined) {
		dataRecord && this.node2Data.set(element, dataRecord);
	}

	resolveCallbacks(element: Element, child: Node) {
		/**
		 * Bubble up callbacks record until it reaches root.
		 * if it finds data, call callbacks and remove them.
		 * if it reaches root, append root callbacks
		 */
		const bubbleUp = (
			ancestor: Element,
			callbacksRecord: Record<string, DataCallback[]>,
		) => {
			const dataRecord = this.node2Data.get(ancestor);
			resolveCallbacksByData(callbacksRecord, dataRecord);

			// Callbacks resolved
			if (!Object.keys(callbacksRecord).length) return;

			// Root
			// append callbacks
			if (!ancestor.parentElement) {
				if (!this.node2DescendantCallbacks.has(ancestor)) {
					this.node2DescendantCallbacks.set(ancestor, {});
				}
				const rootCallbacks = this.node2DescendantCallbacks.get(ancestor);
				rootCallbacks && appendCallbacksRecord(rootCallbacks, callbacksRecord);
				return;
			}

			bubbleUp(ancestor.parentElement, callbacksRecord);
		};

		const callbacks = this.node2DescendantCallbacks.get(child);
		if (callbacks) {
			bubbleUp(element, callbacks);
		}
	}

	node2DescendantCallbacks = new WeakMap<
		Node,
		Record<string, DataCallback[]>
	>();
}

/**
 * Resolve callbacks.
 * Resolved keys are deleted
 */
function resolveCallbacksByData(
	callbacksRecord: Record<string, DataCallback[]>,
	dataRecord: Record<string, any> | undefined,
) {
	for (const key in dataRecord) {
		if (key in callbacksRecord) {
			for (const callback of callbacksRecord[key]) {
				callback(dataRecord[key]);
			}

			delete callbacksRecord[key];
		}
	}
}

export type DataRecord = Record<string, DataCallback | any>;
export const nodeData = new NodeData();
export function initializeData(element: Element, data: DataRecord | undefined) {
	nodeData.setCallbackRecord(element, extractCallbackRecord(data));
	nodeData.setDataRecord(element, extractDataValueRecord(data));
}

export function extractCallbackRecord(
	record: DataRecord | undefined,
): Record<string, DataCallback[]> | undefined {
	return extractRecordFromDataRecord(
		record,
		(value) => typeof value === "function",
		(callback) => [callback],
	);
}

export function extractDataValueRecord(
	record: DataRecord | undefined,
): Record<string, any> | undefined {
	return extractRecordFromDataRecord(
		record,
		(value) => typeof value !== "function",
	);
}

function extractRecordFromDataRecord(
	record: DataRecord | undefined,
	predicate: (value: any) => boolean,
	map = (value: any) => value,
) {
	if (!record) return;

	const result = {} as Record<string, any>;
	for (const key in record) {
		const value = record[key];
		if (predicate(value)) {
			result[key] = map(value);
		}
	}

	if (!Object.keys(result).length) return;

	return result;
}

export function createDescendantCallbacks(
	record: Record<string, DataCallback> | undefined,
) {
	return extractRecordFromDataRecord(
		record,
		() => true,
		(value) => [value],
	);
}

export function appendCallbacksRecord(
	record1: Record<string, DataCallback[]>,
	record2: Record<string, DataCallback[]> | undefined,
) {
	for (const key in record2) {
		if (!record1[key]) {
			record1[key] = [];
		}
		record1[key].push(...record2[key]);
	}
}
