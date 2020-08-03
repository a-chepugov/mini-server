import {ServerResponse} from "http";
import {Send} from "./interface";

export class base<T> implements Send<ServerResponse, T> {
	static send = <T>(response: ServerResponse, payload: T): any => response.end(payload);

	send(response: ServerResponse, payload: T) {
		return base.send(response, payload);
	};
}

export default base;
