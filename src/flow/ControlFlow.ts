export abstract class ControlFlow {
	next: ControlFlow | Node | null = null;
	firstNode: Node | null = null;

	abstract run(element: Element): void;
}
