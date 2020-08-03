import {IncomingMessage} from "http";
import {Parse} from "./interface";
import {toString} from "../../../library/Stream";

export class base implements Parse<IncomingMessage, Promise<string>> {
	static parse = (source: IncomingMessage) => toString(source);

	parse(source: IncomingMessage) {
		return base.parse(source);
	};
}

export default base;
