import {IncomingMessage, ServerResponse} from "http";

import {Parser} from "./Parser";

export {Parser} from "./Parser";

import {Sender} from "./Sender";

export {Sender} from "./Sender";

export class Context {
	readonly request: IncomingMessage;
	readonly response: ServerResponse;
	readonly state: any;

	constructor(request: IncomingMessage, response: ServerResponse, state: any) {
		this.request = request;
		this.response = response;
		this.state = state;
	}

	parse(type?: string) {
		return Parser.of(type).parse(this.request);
	}

	static parse(type?: string) {
		return function (ctx: Context) {
			return Parser.of(type).parse(ctx.request)
		}
	}

	send(payload: any, type?: string) {
		return Sender.of(type).send(this.response, payload);
	}

	static send(type?: string) {
		return function (ctx: Context, payload: any) {
			return Sender.of(type).send(ctx.response, payload)
		}
	}

}

export default Context;
