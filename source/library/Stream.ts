import ReadableStream = NodeJS.ReadableStream;

export const toString = (stream: ReadableStream): Promise<string> =>
	new Promise((resolve, reject) => {
		let accumulator = '';
		stream
			.setEncoding('utf8')
			.on('data', (chunk) => accumulator += chunk)
			.on('error', reject)
			.on('end', () => resolve(accumulator))
	})

export const toJSON = (stream: ReadableStream) => toString(stream).then(JSON.parse);
