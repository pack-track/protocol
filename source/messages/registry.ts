import { Message } from "../message";
import { LoginMessage } from "./login";
import { ConnectMessage } from './connect';
import { MonitorRouteMessage } from './monitor/route';
import { MonitorTrainPositionMessage } from "./monitor/train/position";
import { PointerHitMessage } from "./pointer/hit";
import { PointerOutMessage } from "./pointer/out";
import { MonitorTrainSpeedPermitMessage } from "./monitor/train/speed-permit";
import { ThrottleSpeedMessage } from "./throttle/speed";
import { ThrottleEmergencyMessage } from "./throttle/emergency";
import { ThrottleButtonLightMessage } from "./throttle/button/light";
import { ThrottleButtonPressMessage } from "./throttle/button/press";
import { ThrottleTachometerMessage } from "./throttle/tachometer";
import { TypedMessage } from ".";

// all standardized message types
export const messageTypes = [
	LoginMessage,
	ConnectMessage,

	PointerHitMessage,
	PointerOutMessage,

	MonitorRouteMessage,
	MonitorTrainPositionMessage,
	MonitorTrainSpeedPermitMessage,

	ThrottleSpeedMessage,
	ThrottleEmergencyMessage,
	ThrottleTachometerMessage,
	ThrottleButtonLightMessage,
	ThrottleButtonPressMessage
];

export const findMessageType = (message: Message): typeof TypedMessage => {
	for (let type of messageTypes) {
		if (message.routes(...type.route)) {
			return type as typeof TypedMessage;
		}
	}
}
