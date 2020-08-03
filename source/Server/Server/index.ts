import * as http from "http";

import {Core} from "../Core";

export {Core} from "../Core";

import {Controller, Context, ContextListener} from "../Controller";

export {Controller, Context, ContextListener} from "../Controller";

/**
 * @description Server with chain builder
 */
export class Server extends Core {
	protected readonly _controller: Controller;

	private constructor(controller: Controller) {
		super(controller.listen);
		Object.defineProperty(this, '_controller', {value: controller});
	}

	static create(listeners?: Iterable<ContextListener>) {
		return new Server(new Controller(listeners));
	}

	/**
	 * @description adds listener into connection handlers chain
	 */
	use = (listener: ContextListener) => {
		this._controller.register(listener);
		return this;
	}

	/**
	 * @description removes listener from connection handlers chain
	 */
	unuse = (listener: ContextListener) => {
		this._controller.unregister(listener);
		return this;
	}

	/**
	 * @description sets setter for every connection context state
	 */
	state = (setter: (request: http.IncomingMessage, response: http.ServerResponse) => any) => {
		this._controller.state(setter);
		return this;
	};

	/**
	 * @description sets error handler for connection handler chain
	 */
	interceptor = (interceptor: (ctx: Context, error: any) => void) => {
		this._controller.interceptor(interceptor);
		return this;
	}

}

export default Server;
