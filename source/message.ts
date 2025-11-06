import { PackTrackValue } from "./value";

export class Message {
	static readonly routeIdentifierName = /^[a-z\-0-9]+$/;
	static readonly headerIdentifierName = /^[a-z\-0-9]+$/;

	constructor(
		public route: string[],
		public headers: Record<string, PackTrackValue> = {},
		public body?: Uint8Array
	) {
		for (let routePart of route) {
			if (!Message.routeIdentifierName.test(routePart)) {
				throw new Error('Invalid route segment name');
			}
		}

		for (let name in headers) {
			const headerValue = headers[name];

			if (!Message.headerIdentifierName.test(name)) {
				throw new Error('Invalid header name');
			}

			if (typeof headerValue == 'object' && headerValue !== null && 'toPackTrackMessage' in headerValue) {
				this.headers[name] = headerValue.toPackTrackValue();
			}
		}

		// remove empty bodies
		if (body?.byteLength == 0) {
			this.body = null;
		}
	}

	static dispatch(before: Uint8Array, next: Uint8Array, handler: (message: Message) => void): Uint8Array {
		const source = new Uint8Array(before.byteLength + next.byteLength);
		source.set(new Uint8Array(before));
		source.set(new Uint8Array(next), before.byteLength);

		const message = this.readFirst(source);

		if (message) {
			handler(message.message);

			return this.dispatch(source.subarray(message.nextStart), new Uint8Array(0), handler);
		}

		return source;
	}

	static readFirst(source: Uint8Array) {
		const sourceView = new Uint8Array(source);

		try {
			const header = this.readHeader(sourceView);
			const length = +(header.headers['length'] ?? 0);

			if (length <= sourceView.byteLength - header.dataStart) {
				return {
					message: new Message(
						header.route,
						header.headers,
						sourceView.subarray(header.dataStart, header.dataStart + length)
					),

					nextStart: header.dataStart + length
				};
			}
		} catch {}
	}

	private static readHeader(source: Uint8Array) {
		let headerLength = 0;

		for (; headerLength + 1 < source.byteLength; headerLength++) {
			if (source[headerLength] == 0x0a && source[headerLength + 1] == 0x0a) {
				break;
			}
		}

		if (headerLength + 1 >= source.byteLength) {
			throw new Error('Unterminated header in message');
		}

		const header = source.subarray(0, headerLength).toString();

		if (!header.startsWith('PT ')) {
			throw new Error('No PT header found in message');
		}

		const headerLines = header.split('\n');

		const routeLine = headerLines.shift()!;
		const routeString = routeLine.split(' ')[1];

		if (!routeString) {
			throw new Error('Empty route in message');
		}

		const headers = {};

		for (let headerLine of headerLines) {
			let name;
			let value;

			if (headerLine.includes(':')) {
				const parts = headerLine.split(': ');

				name = parts.shift()!;
				value = parts.join(': ');
			} else {
				name = headerLine;
				value = true;
			}

			if (name in headers) {
				throw new Error('Duplicate header in message');
			}

			headers[name] = value;
		}

		return {
			route: routeString.split('/'),
			headers,
			dataStart: headerLength + 2
		};
	}

	static from(source: Uint8Array) {
		const data = this.readFirst(source);

		if (!data) {
			throw new Error('Message incomplete');
		}

		if (data.nextStart != source.byteLength) {
			throw new Error('Multiple messages passed');
		}

		return data.message;
	}

	routes(...routes: string[]) {
		if (routes.length != this.route.length) {
			return false;
		}

		for (let routeIndex = 0; routeIndex < routes.length; routeIndex++) {
			if (routes[routeIndex] != this.route[routeIndex]) {
				return false;
			}
		}

		return true;
	}

	// generates a buffer to send over the network
	//
	// node only
	toBuffer() {
		let header = `PT ${this.route.join('/')}\n`;

		for (let name in this.headers) {
			const value = this.headers[name];

			if (value === true) {
				header += `${name}\n`;
			} else {
				header += `${name}: ${value}\n`;
			}
		}

		header += '\n';

		if (this.body) {
			return Buffer.concat([Buffer.from(header), Buffer.from(this.body)]);
		}

		return Buffer.from(header);
	}
}
