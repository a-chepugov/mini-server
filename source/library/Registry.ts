export class Registry<K, V> {
	private readonly registry: Map<K, V>;

	constructor() {
		this.registry = new Map<K, V>();
	}

	set = (key: K, value: V) => {
		this.registry.set(key, value);
		return this;
	}

	get = (key: K) => {
		return this.registry.get(key);
	}

	has = (key: K) => {
		return this.registry.has(key);
	}

	del = (key: K) => {
		this.registry.delete(key);
		return this;
	}

	flush = () => {
		this.registry.clear();
		return this;
	}
}

export default Registry;
