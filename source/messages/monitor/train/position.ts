import { TypedMessage } from "../..";

export class MonitorTrainPositionMessage extends TypedMessage {
	static route = ['monitor', 'train', 'position'];

	constructor(
		public train: string,

		public position: {
			section: string,
			offset: number,
			time: Date
		},
	) {
		super({
			train,

			'position-section': position.section,
			'position-offset': position.offset,
			'position-time': +position.time
		});
	}
}
