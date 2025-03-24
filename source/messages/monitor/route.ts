import { TypedMessage } from "..";

export class MonitorRouteMessage extends TypedMessage {
	static route = ['monitor', 'route'];

	constructor(
		public router: string,
		public activeRoute: string
	) {
		super({
			router,
			'active-route': activeRoute
		});
	}
}
