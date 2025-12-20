export type DataCallback = (data: any) => void;

export class NodeData {
	node2Data = new WeakMap<Node, Record<string, any>>();

	addCallbacks(
		element: Node,
		callbackRecord: Record<string, DataCallback[]> | undefined,
	) {
		if (!callbackRecord) return;
		if (!this.node2DescendantCallbacks.has(element)) {
			this.node2DescendantCallbacks.set(element, {});
		}
		const originalCallbackRecord = this.node2DescendantCallbacks.get(element)!;
		appendCallbacksRecord(originalCallbackRecord, callbackRecord);
		const dataRecord = this.node2Data.get(element);
		resolveCallbacksByData(originalCallbackRecord, dataRecord);
	}

	setDataRecord(element: Node, dataRecord: Record<string, any> | undefined) {
		dataRecord && this.node2Data.set(element, dataRecord);
	}

	resolveCallbacks(element: Node, child: Node) {
		/**
		 * Bubble up callbacks record until it reaches root.
		 * if it finds data, call callbacks and remove them.
		 * if it reaches root, append root callbacks
		 */
		const bubbleUp = (
			ancestor: Node,
			callbacksRecord: Record<string, DataCallback[]>,
		) => {
			resolveCallbacksByData(callbacksRecord, this.node2Data.get(ancestor));

			// If callbacks are empty (resolved), finish bubbling up
			if (!Object.keys(callbacksRecord).length) return;

			// If it is root,
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
export function initializeData(element: Node, data: DataRecord | undefined) {
	nodeData.addCallbacks(element, extractCallbackRecord(data));
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

export function findData(node: Node | null, key: string) {
	if (!node) return;

	const record = nodeData.node2Data.get(node);
	if (record && key in record) {
		return record[key];
	}
	return findData(node.parentElement, key);
}

export function waitForData(node: Node, key: string) {
	return new Promise<any>((resolve) => {
		nodeData.addCallbacks(node, { [key]: [resolve] });
	});
}
