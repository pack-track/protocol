import { Message } from "../message";
import { PackTrackValue } from "../value";

export class TypedMessage extends Message {
	static route: string[];

	constructor(
		headers: Record<string, PackTrackValue>
	) {
		super([], headers);

		this.route = (this.constructor as typeof TypedMessage).route;
	}
}
