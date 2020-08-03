import * as net from "net";
import {expect} from "chai";

import Testee from "./index";

import * as port from "../../../tests/helpers/port";

describe("Server Core", () => {

	it("constructor does not initialize server", () => {
		let counter = 0;
		const instance = new Testee(() => counter++);
		expect(counter).to.be.equal(0);
	});

	it("start method initializes server", () => {
		let counter = 0;
		const instance = new Testee((): any => undefined);
		instance.server.unref();
		return new Promise((resolve) => instance.start(() => resolve(counter++)))
			.then(() => expect(counter).to.be.equal(1))
	});

	it("`host` method sets host to listen", () => {
		const instance = new Testee((): any => undefined);
		const host = '127.0.0.' + (Math.ceil(Math.random() * 254));
		instance.host(host);
		instance.server.unref();
		return new Promise((resolve) => instance.start(resolve))
			.then(() => {
				const address = instance.server.address() as net.AddressInfo;
				expect(address.address).to.be.equal(host)
			})
	});

	it("`port` method sets port to listen", () => {
		const instance = new Testee((): any => undefined);
		instance.server.unref();
		return port.get()
			.then((port: number) => {
				if (port) {
					instance.port(port);
					return new Promise((resolve) => instance.start(resolve))
						.then(() => {
							const address = instance.server.address() as net.AddressInfo;
							expect(address.port).to.be.equal(port)
						})
				} else {
					throw new Error('Port is not defined: ' + port);
				}
			})
	});

	it("`on` method sets host and port to listen", () => {
		const instance = new Testee((): any => undefined);
		const host = '127.0.0.' + (Math.ceil(Math.random() * 254));
		instance.server.unref();
		return port.get()
			.then((port: number) => {
				if (port) {
					instance.on(host, port);
					return new Promise((resolve) => instance.start(resolve))
						.then(() => {
							const address = instance.server.address() as net.AddressInfo;
							expect(address.address).to.be.equal(host)
							expect(address.port).to.be.equal(port)
						})
				} else {
					throw new Error('Port is not defined: ' + port);
				}
			})
	});

	it.skip("example", () => {
		const server = require('./index');

		const HOST = '127.0.0.1';
		const PORT = 3000;
		new server.Core((request: any, response: any) => response.end('online'))
			.on(HOST, PORT)
			.start(() => console.info(`Server started on http://${HOST}:${PORT} at ${new Date().toISOString()}`))
			.server.unref();
	});

})
