import { TypedMessage } from "..";

export class ThrottleTachometerMessage extends TypedMessage {
	static route = ['throttle', 'tachometer'];

	constructor(
		public speed: number
	) {
		super({
			speed
		});
	}
}
