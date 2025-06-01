import { TypedMessage } from "..";

export class ThrottleLockMessage extends TypedMessage {
	static route = ['throttle', 'lock'];

	constructor(
		public train: string
	) {
		super({
			train
		});
	}
}
