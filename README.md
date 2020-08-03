# Server
Lightweight HTTP Server.

## Usage

### Server
- Creation of server instance on specific port and host
```js
const HOST = '127.0.0.1';
const PORT = 3000;

server
    .create()
    .on(HOST, PORT)
    .start(() => console.info(`Server started on http://${HOST}:${PORT} at ${new Date().toISOString()}`))
```

### Connection handlers
- Connection can be handled by listeners passed to `create` method

```js
let counter = 0;
const listener1 = () => counter++;
const listener2 = (ctx) => ctx.response.end('online');

server.create([listener1, listener2])
```
or

- Add listeners into connection handler chain via `use` method
```js
let counter = 0;
server
    .create()
    .use(() => counter++)
    .use((ctx, input) => ctx.response.end((new Date()).toISOString()))
```

- Remove listeners from connection handler chain
```js
const listener = (ctx, input) => ctx.response.end(input);

server
    .create()
    .use(listener)
    .unuse(listener)
```
Important! Listeners are identified by reference.

It's possible to add or remove listeners in any moment

- Every listener has ctx (Connection context) as first argument and previous listener result as second argument
```js
server
    .create()
    .use(() => new Date())
    .use((ctx, input) => ctx.response.end(input.toISOString()))
```

#### Connection context
- Context contains request and response elements - http.IncomingMessage and http.ServerResponse
```js
const {request, response, state} = ctx;
```

- Context can be modified with state for every connection
```js
const LENGTH = 32;
const stateInitializer = (request, response) => {
    const requestId = request.headers['request-id'];
    const id = typeof requestId === 'string' && requestId.length === LENGTH ?
                 requestId :
                 Array.from(new Array(LENGTH), () => Math.floor(Math.random() * 36).toString(36)).join('');
    return {id};
}

server
    .create()
    .state(stateInitializer)
    .use((ctx) => ctx.state.id.length === LENGTH)
```

Context is frozen. It's IMPOSSIBLE to modify it after creation. You should use state to make all necessary preparations.
Another way to handle connection is to pass data from listener to listener in handler chain:
listener second arguments is previous listener result.

#### Context methods

##### parse
Context contains method `parse` to convert request stream to another format

Available formats:
- base (returns string)
- JSON

```js
server
    .create()
    .use((ctx) =>
        ctx
            .parse('json')
            .then((response) => console.log(response))
    )
```

Or using static method

```js
server
    .create()
    .use(server.Context.parse('json'))
    .use((ctx, input) => console.log(input))
```

##### send
Context contains method `send` to pass data to response stream

Available formats:
- string (useful for string or buffer)
- JSON
- stream
- stringable (useful for objects with `toString` method)

```js
server
    .create()
    .use((ctx) =>
        ctx.send({a: 1}, 'json')
    )
```

Or using static method

```js
server
    .create()
    .use(() => ({a: 1}))
    .use(server.Context.send('json'))
```

##### Custom formats
It can be useful to add custom format to context parser or sender

```js
const unicornSender = {send: (response, unicorn) => response.end(unicorn.name)}
server.Sender.register('unicorn', unicornSender)
```

### Error interceptor

It's possible to set custom function to handle errors in that occurs during request handling

```js
server
    .create()
    .interceptor((cxt, error) => {
        if (!ctx.response.finished) {
            ctx.response.end();
        }
        console.error(error);
    })
    .use((ctx) => {
        throw new Error('My error');
    })
```

### Server core
```js
const HOST = '127.0.0.1';
const PORT = 3000;
new server.Core((request, response) => response.end('online'))
    .on(HOST, PORT)
    .start(() => console.info(`Server started on http://${HOST}:${PORT} at ${new Date().toISOString()}`))
```

- It's possible to work with original http server entity via `server` property of instance
```js
const instance = server.create();
instance.server; // http.Server
```

## Cautions
- Needs node >= 10 for work
