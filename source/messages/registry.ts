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
import { TrainSpeedPermit } from "./train/speed/permit";
import { ThrottleLockMessage } from "./throttle/lock";
import { RouteLockMessage } from "./route/lock";
import { RouteLockedMessage } from "./route/locked";

// all standardized message types
export const messageTypes = [
	LoginMessage,
	ConnectMessage,

	PointerHitMessage,
	PointerOutMessage,

	RouteLockMessage,
	RouteLockedMessage,

	MonitorRouteMessage,
	MonitorTrainPositionMessage,
	MonitorTrainSpeedPermitMessage,

	ThrottleSpeedMessage,
	ThrottleEmergencyMessage,
	ThrottleLockMessage,
	ThrottleTachometerMessage,
	ThrottleButtonLightMessage,
	ThrottleButtonPressMessage,

	TrainSpeedPermit
];

export const findMessageType = (message: Message): typeof TypedMessage => {
	for (let type of messageTypes) {
		if (message.routes(...type.route)) {
			return type as typeof TypedMessage;
		}
	}
}
