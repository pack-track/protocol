import { TypedMessage } from "..";

export class RouteLockMessage extends TypedMessage {
	static route = ['route', 'lock'];

	constructor(
		public router: string,
		public routeName: string,
		public channel: string,
		public command: string
	) {
		super({
			router,
			route: routeName,
			channel,
			command
		});
	}
}
