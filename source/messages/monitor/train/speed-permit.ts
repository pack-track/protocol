import { TypedMessage } from "../..";

export class MonitorTrainSpeedPermitMessage extends TypedMessage {
	static route = ['monitor', 'train', 'permit'];

	constructor(
		public train: string,
		public issued: Date,
		public speed: number
	) {
		super({
			train,
			issued: issued.toISOString(),
			speed
		});
	}
}
