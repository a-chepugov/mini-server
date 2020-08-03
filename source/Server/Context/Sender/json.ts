import {Send} from './interface'
import {ServerResponse} from "http";

export class json implements Send<ServerResponse, Object> {
	static send (response: ServerResponse, payload: Object) {
		const result = JSON.stringify(payload);
		response.setHeader('Content-Type', 'application/json');
		return response.end(result);
	}

	send(response: ServerResponse, payload: Object) {
		return json.send(response, payload);
	}
}

export default json;
