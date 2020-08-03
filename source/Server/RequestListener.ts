import {IncomingMessage, ServerResponse} from "http";

export type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;
export default RequestListener;
