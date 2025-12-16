export class NodeData {
	node2Data = new Map<Node, Record<string, any>>();
	node2DataCallbacks = new Map<Node, Record<string, (data: any) => void>>();

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

	resolveDataCallback(element: Element, child: Node) {
		for (const key in this.node2DataCallbacks.get(child)) {
			const callback = this.node2DataCallbacks.get(child)![key];
			const data = this.node2Data.get(element)?.[key];
			if (data !== undefined) {
				callback(data);
			}
		}
	}
}
