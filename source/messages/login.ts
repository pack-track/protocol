import { TypedMessage } from ".";

export class LoginMessage extends TypedMessage {
	static route = ['login'];

	constructor(
		public device: string
	) {
		super({
			device
		});
	}
}
