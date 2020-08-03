import {IncomingMessage, ServerResponse} from "http";

export class Context {
	readonly request: IncomingMessage;
	readonly response: ServerResponse;
	readonly state: any;

	constructor(request: IncomingMessage, response: ServerResponse, state: any) {
		this.request = request;
		this.response = response;
		this.state = state;
	}

}

export default Context;
