import * as http from "http";
import RequestListener from "../RequestListener";

/**
 * @description Wrapper around http.createServer
 */
export class Core {
	protected readonly _listener: RequestListener;
	protected readonly _server: http.Server;
	protected _port: number;
	protected _host: string;
	protected _backlog: number;

	/**
	 * @param {RequestListener} listener - server request handler
	 */
	constructor(listener: RequestListener) {
		Object.defineProperty(this, '_listener', {value: listener});
		Object.defineProperty(this, '_server', {value: http.createServer(this._listener)});
	}

	/**
	 * @param {string} host - defines host to lister
	 */
	host(host: string) {
		Object.defineProperty(this, '_host', {value: host});
		return this;
	}

	/**
	 * @param {number} port - defines port to lister
	 */
	port(port: number) {
		Object.defineProperty(this, '_port', {value: port});
		return this;
	}

	/**
	 * @param {number} backlog - defines server backlog value
	 */
	backlog(backlog: number) {
		Object.defineProperty(this, '_backlog', {value: backlog});
		return this;
	}

	/**
	 * @param {string} host - define host to lister
	 * @param {number} port - defines port to lister
	 */
	on(host: string, port: number) {
		return this.host(host).port(port);
	}

	/**
	 * @description attach server to predefined host and port
	 * @param {function} callback - invokes on server start
	 */
	start = (callback?: () => void) => {
		this._server.listen(this._port, this._host, this._backlog, callback);
		return this;
	}

	get server() {
		return this._server;
	}
}

export default Core;
