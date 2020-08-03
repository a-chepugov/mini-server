export interface Parse<SOURCE, R> {
	parse(source: SOURCE): R;
}

export default Parse;
