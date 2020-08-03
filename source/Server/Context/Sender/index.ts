import {Send} from "./interface";
import {Registry} from "../../../library/Registry";

export class Sender {
	private static readonly registry = new Registry<string, Send<any, any>>();

	static register(name: string, strategy: Send<any, any>) {
		Sender.registry.set(name, strategy);
		return Sender;
	}

	static of(type: string) {
		const registry = Sender.registry;
		if (type && registry.has(type)) {
			return registry.get(type);
		} else {
			return registry.get('json');
		}
	}
}

Object.freeze(Sender);

export default Sender;

import base from "./base";
import json from "./json";
import stream from "./stream";
import stringable from "./stringable";

Sender
	.register('base', base)
	.register('json', json)
	.register('stream', stream)
	.register('stringable', stringable)
;
