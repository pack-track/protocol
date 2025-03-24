import { TypedMessage } from "../..";

export class ThrottleButtonLightMessage extends TypedMessage {
	static route = ['throttle', 'button', 'light'];

	constructor(
		public channel: string,
		public brightness: number
	) {
		super({
			channel,
			brightness
		});
	}
}
