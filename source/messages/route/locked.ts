import { TypedMessage } from "..";

export class RouteLockedMessage extends TypedMessage {
	static route = ['route', 'locked'];

	constructor(
		public router: string,
		public routeName: string
	) {
		super({
			router,
			route: routeName
		});
	}
}
