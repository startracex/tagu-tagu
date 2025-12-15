export abstract class ControlFlow {
	next: ControlFlow | Node | null = null;
	nodes = [] as Node[];

	abstract run(element: Element): void;
}
