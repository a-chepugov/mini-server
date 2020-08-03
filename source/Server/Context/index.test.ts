import {expect} from "chai";

import Context from "./index";
import Server from "../Server";

import * as port from "../../../tests/helpers/port";
import Request from "../../../tests/helpers/Request";

const getFreePortAndStartServer = (instance: Server) => {
	const host = '127.0.0.' + (Math.ceil(Math.random() * 254));
	return port.get()
		.then((port: number) => {
			if (port) {
				instance.on(host, port);
				return new Promise((resolve) => instance.start(() => resolve({host, port})))
			} else {
				throw new Error('Port is not defined: ' + port);
			}
		})
}

describe("Context", () => {

	it("context instance parse method", () => {
		const instance = Server.create();

		return new Promise((resolve, reject) => {
			instance
				.use((ctx: any) => ctx
					.parse('base')
					.then((response: any) => expect(response).to.be.equal('test'))
					.then(resolve)
					.catch(reject)
				)
				.server.unref()

			return getFreePortAndStartServer(instance)
				.then(({host, port}) =>
					Request
						.execute({hostname: host, port, method: 'POST', path: '/'}, 'test')
				)
		});
	});

	it("context static parse method", () => {
		const instance = Server.create();

		return new Promise((resolve, reject) => {
			instance
				.use(Context.parse('base'))
				.use((ctx: any, input) => {
					return Promise.resolve(input)
						.then((response: any) => expect(response).to.be.equal('test'))
						.then(resolve)
						.catch(reject)
				})
				.server.unref()

			return getFreePortAndStartServer(instance)
				.then(({host, port}) =>
					Request
						.execute({hostname: host, port, method: 'POST', path: '/'}, 'test')
				)
		});
	});

	it("context instance send method", () => {
		const instance = Server.create();

		instance
			.use((ctx: any) => ctx.send('unicorn', 'base'))
			.server.unref()

		return getFreePortAndStartServer(instance)
			.then(({host, port}) =>
				Request
					.execute({hostname: host, port, method: 'POST', path: '/'}, 'test')
					.then(({body}: { body: string }) => expect(body).to.be.equal('unicorn'))
			)
	});

	it("context static send method", () => {
		const instance = Server.create();

		instance
			.use(() => 'unicorn')
			.use(Context.send('base'))
			.server.unref()

		return getFreePortAndStartServer(instance)
			.then(({host, port}) =>
				Request
					.execute({hostname: host, port, method: 'POST', path: '/'}, 'test')
					.then(({body}: { body: string }) => expect(body).to.be.equal('unicorn'))
			)
	});

})
