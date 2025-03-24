import { TypedMessage } from "..";

export class ThrottleSpeedMessage extends TypedMessage {
	static route = ['throttle', 'speed'];

	constructor(
		public speed: number
	) {
		super({});
	}
}
