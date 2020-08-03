import {Parse} from "./interface";
import {Registry} from "../../../library/Registry";

export class Parser {
	private static readonly registry = new Registry<string, Parse<any, any>>();

	static register(name: string, strategy: Parse<any, any>) {
		Parser.registry.set(name, strategy);
		return Parser;
	}

	static of(type: string) {
		const registry = Parser.registry;
		if (type && registry.has(type)) {
			return registry.get(type);
		} else {
			return registry.get('base');
		}
	}

}

Object.freeze(Parser);

export default Parser;

import base from "./base";
import json from "./json";
import Sender from "../Sender";

Parser
	.register('base', base)
	.register('json', json)
;
