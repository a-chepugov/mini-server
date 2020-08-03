import {Send} from './interface'

type ReadableStream = NodeJS.ReadableStream;
import {ServerResponse} from "http";

export class stream implements Send<ServerResponse, ReadableStream> {
	static send = <T extends ReadableStream>(response: ServerResponse, payload: T) => payload.pipe(response);

	send(response: ServerResponse, payload: ReadableStream) {
		return stream.send(response, payload);
	}
}

export default stream;
