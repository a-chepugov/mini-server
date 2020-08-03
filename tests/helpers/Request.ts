import * as http from 'http';

type Options = {
	hostname: string,
	port: number,
	path: string,
	method: string,
	headers?: {
		[key: string]: string | number
	}
}

export class Request {
	static execute = (options: Options, payload = '') => {
		return new Promise((resolve, reject) => {
			const request = http.request(options, (response: http.IncomingMessage) => {
				let body = '';
				response
					.setEncoding('utf8')
					.on('data', (chunk: string) => body += chunk)
					.on('error', (error: any) => reject(error))
					.on('end', () => resolve({response, body}))
				;
			})
			request.write(payload)
			request.end();
		});
	}
}

export default Request;
