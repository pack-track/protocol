import { TypedMessage } from "..";

export class ThrottleEmergencyMessage extends TypedMessage {
	static route = ['throttle', 'emergency'];

	constructor() {
		super({});
	}
}
