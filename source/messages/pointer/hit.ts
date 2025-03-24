import { TypedMessage } from "..";

export class PointerHitMessage extends TypedMessage {
	static route = ['pointer', 'hit'];

	constructor(
		public channel = 'any'
	) {
		super({});
	}
}
