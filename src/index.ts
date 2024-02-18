import { IncomingMessage, RequestListener, ServerResponse, createServer } from 'http';

type AppRequestListener = RequestListener<typeof IncomingMessage, typeof ServerResponse> | undefined;

const host = 'localhost';
const port = 8000;

const requestListener: AppRequestListener =  (req, res) => {
    res.writeHead(200);
    res.end("My first server!");
};

const server = createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

console.log('Hello world!')