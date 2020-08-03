import {IncomingMessage} from "http";
import {Parse} from "./interface";
import {toJSON} from "../../../library/Stream";

export class json implements Parse<IncomingMessage, Promise<Object>> {
	static parse = (source: IncomingMessage) => toJSON(source);

	parse(source: IncomingMessage) {
		return json.parse(source);
	}
}

export default json;
