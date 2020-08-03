export interface Send<TARGET, PAYLOAD> {
	send(target: TARGET, payload: PAYLOAD): any;
}

export default Send;
