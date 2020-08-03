import {STATUS_CODES} from "http";
import * as url from "url";

import Method from "../Method";

import {Controller, Context as ControllerContext, ContextListener} from "../Server/Controller";

import {Context, Parameters} from "./Context";

export {Context, Parameters} from "./Context";

type RouteMatcher = string | RegExp;
type RouteHandler = (ctx: Context, input?: any) => any;

export class Router {
	protected _handlers: Map<Method, Map<RouteMatcher, { pattern: RegExp, handler: RouteHandler }>>;

	constructor() {
		this._handlers = new Map();
		Object.freeze(this);
	}

	get handlers() {
		return Array
			.from(this._handlers.entries())
			.reduce((accumulator: any, [method, handlers]) => {
				accumulator.set(method, new Map(handlers));
				return accumulator;
			}, new Map);
	}

	private setRouterHandler = (method: Method, matcher: RouteMatcher, handler: RouteHandler) => {
		method = String.prototype.toLocaleUpperCase.call(method);
		let methodHandlers = this._handlers.get(method)

		if (!methodHandlers) {
			methodHandlers = new Map();
			this._handlers.set(method, methodHandlers);
		}
		if (typeof matcher === 'string') {
			const matchedWithGroups = matcher.replace(/\/:(\w+)/g, '/(?<$1>\\w*)');
			const pattern = new RegExp(`^${matchedWithGroups}$`);
			methodHandlers.set(matcher, {pattern, handler});
		} else {
			methodHandlers.set(matcher, {pattern: matcher, handler});
		}
		return this;
	}

	private getRouterHandler = (method: Method, pathname: string): [RouteHandler, Parameters] | undefined => {
		const methodHandlers = this._handlers.get(method);
		if (methodHandlers) {
			const entriesIterator = methodHandlers.values();
			for (const {pattern, handler} of entriesIterator) {
				const matched = pattern.exec(pathname)
				if (matched) {
					return [handler, matched.groups || {}] as [RouteHandler, Parameters];
				}
			}
		}
	}

	on = (method: Method, matcher: RouteMatcher, ...listeners: RouteHandler[]) => {
		const listener = listeners.length === 1 ? listeners[0] : Controller.builder(listeners);
		this.setRouterHandler(method, matcher, listener);
		return this;
	}

	listen: ContextListener = (ctx: ControllerContext, input: any) => {
		const anUrl = url.parse(ctx.request.url);
		const [handler, parameters] = this.getRouterHandler(ctx.request.method, anUrl.pathname) || [];
		if (handler) {
			const ctxParameterized = new Context(ctx.request, ctx.response, ctx.state, parameters);
			return handler(Object.freeze(ctxParameterized), input);
		} else {
			const error = new Error(STATUS_CODES[404]);
			// @ts-ignore
			error.code = 404;
			throw error;
		}
	}

	append = (source: Router): Router => {
		return Array
			.from(source.handlers)
			.reduce((self: Router, [method, handlers]) => {
				return Array
					.from(handlers.entries())
					.reduce((self: Router, [matcher, {handler}]) => {
						return self.on(method, matcher, handler);
					}, self)
			}, this) as Router;
	}

	concat = (router: Router): Router => (new Router()).append(this).append(router)
}

export default Router;
