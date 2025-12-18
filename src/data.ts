export class NodeData {
	node2Data = new WeakMap<Node, Record<string, any>>();
	node2DataCallbacks = new WeakMap<Node, Record<string, (data: any) => void>>();

	setCallbackRecord(
		element: Element,
		callbackRecord: Record<string, (data: any) => void> | undefined,
	) {
		callbackRecord && this.node2DataCallbacks.set(element, callbackRecord);

		const dataRecord = this.node2Data.get(element);
		for (const key in dataRecord) {
			if (key in dataRecord) {
				callbackRecord?.[key](dataRecord[key]);
			}
		}
	}

	setDataRecord(element: Element, dataRecord: Record<string, any> | undefined) {
		dataRecord && this.node2Data.set(element, dataRecord);
	}

	getData(element: Element, key: string) {
		return this.node2Data.get(element)?.[key];
	}

	resolveCallbacks(element: Element, child: Node) {
		for (const key in this.node2DataCallbacks.get(child)) {
			const callback = this.node2DataCallbacks.get(child)![key];
			const data = this.node2Data.get(element)?.[key];
			if (data !== undefined) {
				callback(data);
			}
		}

		if (this.node2DataCallbacks.has(child)) {
			const newRecord = {} as Record<string, ((data: any) => void)[]>;
			const source = this.node2DataCallbacks.get(child);
			for (const key in source) {
				if (!newRecord[key]) {
					newRecord[key] = [];
				}
				newRecord[key].push(source[key]);
			}
			this.node2DescendantCallbacks.set(element, newRecord);
		}
	}

	node2DescendantCallbacks = new WeakMap<
		Node,
		Record<string, ((data: any) => void)[]>
	>();

	getDescendantCallbacks(node: Node) {
		return this.node2DescendantCallbacks.get(node);
	}
}

export type DataRecord = Record<string, ((value: any) => void) | any>;
export const nodeData = new NodeData();
export function initializeData(element: Element, data: DataRecord | undefined) {
	nodeData.setCallbackRecord(element, extractCallbackRecord(data));
	nodeData.setDataRecord(element, extractDataValueRecord(data));
}

export function extractCallbackRecord(
	record: DataRecord | undefined,
): Record<string, () => void> | undefined {
	return extractRecordFromDataRecord(
		record,
		(value) => typeof value === "function",
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
) {
	if (!record) return;

	const result = {} as Record<string, any>;
	for (const key in record) {
		const value = record[key];
		if (predicate(value)) {
			result[key] = value;
		}
	}

	if (!Object.keys(result).length) return;

	return result;
}
