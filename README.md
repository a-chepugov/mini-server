# Server
HTTP Server implementation.

## Usage

### Core
```js
const HOST = '127.0.0.1';
const PORT = 3000;
new server.Core((request, response) => response.end('online'))
    .on(HOST, PORT)
	.start(() => console.info(`Server started on http://${HOST}:${PORT} at ${new Date().toISOString()}`))
``

## Cautions
- Needs node >= 10 for work
