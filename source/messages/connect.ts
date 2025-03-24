import { TypedMessage } from ".";

export class ConnectMessage extends TypedMessage {
	static route = ['connect'];

	constructor(
		public version: number
	) {
		super({
			version
		});
	}
}
