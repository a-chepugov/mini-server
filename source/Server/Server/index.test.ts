import {expect} from "chai";

import Testee from "./index";

import * as port from "../../../tests/helpers/port";
import Request from "../../../tests/helpers/Request";

const getFreePortAndStartServer = (instance: Testee) => {
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

describe("Server", () => {

	it("`create` method constructs server with listeners list", () => {
		let count = 0;
		const value = Math.ceil(Math.random() * 999)
		const listener0 = (ctx: any) => {
			count += value;
			ctx.response.end(count + '')
		};
		const instance = Testee.create([listener0]);
		instance.server.unref()

		return getFreePortAndStartServer(instance)
			.then(({host, port}) =>
				Request
					.execute({hostname: host, port, method: 'GET', path: '/'})
					.then((response: {body: string}) => Number(response.body))
					.then((response) => expect(response).to.be.equal(value))
			)
	});

	it("`use` method adds listeners into connection handler chain", () => {
		let count = 0;
		const instance = Testee.create();

		instance
			.use(() => count += 1)
			.use(() => count += 2)
			.use((ctx: any) => ctx.response.end())
			.server.unref()

		return getFreePortAndStartServer(instance)
			.then(({host, port}) =>
				Request
					.execute({hostname: host, port, method: 'GET', path: '/'})
					.then(() => expect(count).to.be.equal(3))
			)
	});

	it("`use` method can be used after server start", () => {
		let count = 0;
		const instance = Testee.create();

		return getFreePortAndStartServer(instance)
			.then((response) => {

				instance
					.use(() => count += 1)
					.use(() => count += 2)
					.use(() => count += 3)
					.use((ctx: any) => ctx.response.end())
					.server.unref()

				return response;
			})
			.then(({host, port}) =>
				Request
					.execute({hostname: host, port, method: 'GET', path: '/'})
					.then(() => expect(count).to.be.equal(6))
			)
	});

	it("`unuse` method removes listeners from connection handler chain", () => {
		let count = 0;
		const instance = Testee.create();

		const listener1 = () => count += 1;
		const listener2 = () => count += 2;
		const listener3 = () => count += 3;

		instance
			.use(listener1)
			.use(listener2)
			.use(listener3)
			.unuse(listener2)
			.use((ctx: any) => ctx.response.end())
			.server.unref()

		return getFreePortAndStartServer(instance)
			.then(({host, port}) =>
				Request
					.execute({hostname: host, port, method: 'GET', path: '/'})
					.then(() => expect(count).to.be.equal(4))
			)
	});

	it("listener in handler chain passes it's result to the next listener", () => {
		const instance = Testee.create();

		const value = Math.ceil(Math.random() * 999)

		return new Promise((resolve, reject) => {
			instance
				.use((ctx: any, input: any) => {
					expect(input).to.be.equal(undefined);
					return value;
				})
				.use((ctx: any, input: any) => Promise
					.resolve()
					.then(() => expect(input).to.be.equal(value))
					.catch(reject)
				)
				.use((ctx: any) => ctx.response.end())
				.server.unref()

			return getFreePortAndStartServer(instance)
				.then(({host, port}) =>
					Request
						.execute({hostname: host, port, method: 'GET', path: '/'})
						.then(resolve)
				)
		});
	});

	it("state set context state create function", () => {
		const instance = Testee.create();

		const value = Math.ceil(Math.random() * 999)
		instance.state(() => value)

		return new Promise((resolve, reject) => {
			instance
				.use((ctx: any) => Promise
					.resolve()
					.then(() => expect(ctx.state).to.be.equal(value))
					.catch(reject)
				)
				.use((ctx: any) => ctx.response.end())
				.server.unref()

			return getFreePortAndStartServer(instance)
				.then(({host, port}) =>
					Request
						.execute({hostname: host, port, method: 'GET', path: '/'})
						.then(resolve)
				)
		});
	});

	it("interceptor set error handler for connection handler chain", () => {
		const instance = Testee.create();

		return new Promise((resolve, reject) => {
			instance
				.interceptor((ctx: any, error: any) => {
					ctx.response.end()
					expect(error.message).to.be.equal('Test');
				})
				.use(() => {
					throw new Error('Test');
				})
				.server.unref()

			return getFreePortAndStartServer(instance)
				.then(({host, port}) =>
					Request
						.execute({hostname: host, port, method: 'GET', path: '/'})
						.then(resolve)
				)
		});
	});

	it.skip("example", () => {
		const server = Testee;

		const HOST = '127.0.0.1';
		const PORT = 3000;

		server
			.create()
			.use((ctx: any) => Date.now())
			.use((ctx: any, input: any) => ctx.response.end(input))
			.on(HOST, PORT)
			.start(() => console.info(`Server started on http://${HOST}:${PORT} at ${new Date().toISOString()}`))
	});

})
