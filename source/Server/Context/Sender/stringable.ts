import {ServerResponse} from "http";
import {Send} from "./interface";

export class stringable implements Send<ServerResponse, { toString: () => string }> {
	static send = (response: ServerResponse, payload: { toString: () => string }) => response.end(payload.toString());

	send(response: ServerResponse, payload: { toString: () => string }) {
		return stringable.send(response, payload);
	};
}

export default stringable;
