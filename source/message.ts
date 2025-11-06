import { PackTrackValue } from "./value";

export class Message {
	static readonly routeIdentifierName = /^[a-z\-0-9]+$/;
	static readonly headerIdentifierName = /^[a-z\-0-9]+$/;

	constructor(
		public route: string[],
		public headers: Record<string, PackTrackValue> = {},
		public body?: Buffer
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
		if (body?.length == 0) {
			this.body = null;
		}
	}

	static dispatch(before: Buffer, next: Buffer, handler: (message: Message) => void): Buffer {
		const source = Buffer.concat([before, next]);
		const message = this.readFirst(source);

		if (message) {
			handler(message.message);

			return this.dispatch(source.subarray(message.nextStart), Buffer.from([]), handler);
		}

		return source;
	}

	static readFirst(source: Buffer) {
		try {
			const header = this.readHeader(source);
			const length = +(header.headers['length'] ?? 0);

			if (length <= source.length - header.dataStart) {
				return {
					message: new Message(header.route, header.headers, source.subarray(header.dataStart, header.dataStart + length)),
					nextStart: header.dataStart + length
				};
			}
		} catch {}
	}

	private static readHeader(source: Buffer) {
		const headerLength = source.indexOf('\n\n');

		if (headerLength == -1) {
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

	static from(source: Buffer) {
		const data = this.readFirst(source);

		if (!data) {
			throw new Error('Message incomplete');
		}

		if (data.nextStart != source.length) {
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
			return Buffer.concat([Buffer.from(header), this.body]);
		}

		return Buffer.from(header);
	}
}
