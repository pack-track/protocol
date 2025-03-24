import { TypedMessage } from "..";

export class PointerOutMessage extends TypedMessage {
	static route = ['pointer', 'out'];

	constructor(
		public channel = 'any'
	) {
		super({});
	}
}
