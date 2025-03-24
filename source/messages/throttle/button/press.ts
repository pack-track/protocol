import { TypedMessage } from "../..";

export class ThrottleButtonPressMessage extends TypedMessage {
	static route = ['throttle', 'button', 'press'];

	constructor(
		public channel: string
	) {
		super({
			channel
		});
	}
}
