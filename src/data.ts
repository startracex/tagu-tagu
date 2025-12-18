export class NodeData {
	node2Data = new WeakMap<Node, Record<string, any>>();
	node2DataCallbacks = new WeakMap<Node, Record<string, (data: any) => void>>();

	setCallback(element: Element, key: string, callback: (data: any) => void) {
		if (!this.node2DataCallbacks.has(element)) {
			this.node2DataCallbacks.set(element, {});
		}
		this.node2DataCallbacks.get(element)![key] = callback;
	}

	setData(element: Element, key: string, value: any) {
		if (!this.node2Data.has(element)) {
			this.node2Data.set(element, {});
		}
		this.node2Data.get(element)![key] = value;
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
	for (const key in data) {
		const value = data[key];
		if (typeof value === "function") {
			nodeData.setCallback(element, key, value);
			const selfValue = nodeData.getData(element, key);
			selfValue && value(selfValue);
		} else {
			nodeData.setData(element, key, value);
		}
	}
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
