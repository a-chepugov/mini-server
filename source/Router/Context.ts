import {Context as ControllerContext} from "../Server/Controller";
import {IncomingMessage, ServerResponse} from "http";

export type Parameters = { [key: string]: string };

export class Context extends ControllerContext {
	readonly parameters: Parameters;

	constructor(request: IncomingMessage, response: ServerResponse, state: any, parameters: Parameters) {
		super(request, response, state);
		this.parameters = parameters;
	}
}

export default Context;
