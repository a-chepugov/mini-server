import * as net from 'net';

export function get(port = 0) {
	return new Promise((resolve, reject) => {
		const server = net.createServer();

		server.on('error', function (error) {
			server.close();
			reject(error);
		});

		server.listen(port, function () {
			const address = server.address() as net.AddressInfo;
			const port = address.port;
			server.close();
			server.unref();

			server.on('close', () => {
				port ?
					resolve(port) :
					reject(port);
			})

		});
	});
}
