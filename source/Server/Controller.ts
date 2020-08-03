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

	constructor(listeners?: Iterable<ContextListener>) {
		this._state = () => undefined;
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

}

export default Controller;
