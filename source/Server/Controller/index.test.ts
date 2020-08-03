import {expect} from "chai";

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

describe("Controller", () => {

	it("default send method", () => {
		const instance = Server.create();

		instance
			.use(() => 'unicorn')
			.server.unref()

		return getFreePortAndStartServer(instance)
			.then(({host, port}) =>
				Request
					.execute({hostname: host, port, method: 'POST', path: '/'}, 'test')
					.then(({body}: { body: string }) => expect(body).to.be.equal('"unicorn"'))
			)
	});

})
