import { TypedMessage } from "../..";

export class TrainSpeedPermit extends TypedMessage {
	static route = ['train', 'speed', 'permit'];

	constructor(
		public speed: number,
		public issued: string,
		public channel: string
	) {
		super({
			speed,
			issued,
			channel
		});
	}
}
