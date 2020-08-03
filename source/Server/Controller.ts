import {IncomingMessage, ServerResponse, STATUS_CODES} from "http";

import {RequestListener} from "./RequestListener";

import {Context} from "./Context";

export {Context} from "./Context";

import {ContextListener} from "./ContextListener";

export {ContextListener} from "./ContextListener";

export class Controller {
	protected readonly _listeners: Set<ContextListener>;
	protected _bundle: ContextListener;
	protected _state: (request: IncomingMessage, response: ServerResponse) => any;
	protected _interceptor: (ctx: any, error: any) => any;

	constructor(listeners?: Iterable<ContextListener>) {
		this._state = () => undefined;
		this.interceptor((ctx: Context, error: { code?: number, reason?: string }) => {
			if (!ctx.response.finished) {
				ctx.response.statusCode = error && error.code ? error.code : 500;
				ctx.response.end(error && error.reason ? error.reason : STATUS_CODES[ctx.response.statusCode]);
			}
			console.error(error);
		})
		this._listeners = new Set(listeners);
		this.build();
	}

	static builder(listeners: Iterable<ContextListener>) {
		return Array
			.from(listeners)
			.reduce(
				(
					handler: (ctx: Context, promise: Promise<any>) => Promise<any>,
					listener: ContextListener,
				) => {
					return (ctx: Context, promise: Promise<any>) => {
						return handler(ctx, promise).then((input: any) => listener(ctx, input));
					}
				},
				(ctx: Context, initial: any) => Promise.resolve(initial)
			)
	}

	private build = () => {
		const folded = Controller.builder(this._listeners.values());

		this._bundle = (ctx: Context, initial: any) =>
			folded(Object.freeze(ctx), initial)
				.catch((error: any) => this._interceptor(ctx, error));

		return this;
	}

	listen: RequestListener = (request, response) => {
		return this._bundle(
			new Context(request, response, this._state(request, response)),
			undefined
		)
	}

	register = (listener: ContextListener) => {
		this._listeners.add(listener);
		return this.build();
	}

	unregister = (listener: ContextListener) => {
		this._listeners.delete(listener);
		return this.build();
	}

	state = (setter: (request: IncomingMessage, response: ServerResponse) => any) => {
		if (typeof setter === 'function') {
			this._state = setter;
			return this;
		} else {
			throw new Error('State setter must be a function');
		}
	}

	interceptor = (interceptor: (ctx: Context, error: any) => any) => {
		if (typeof interceptor === 'function') {
			this._interceptor = interceptor;
			return this;
		} else {
			throw new Error('Interceptor mush be a function');
		}
	}

}

export default Controller;
