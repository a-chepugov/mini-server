import Context from "./Context";

export type ContextListener = (ctx: Context, input?: any) => any;
export default ContextListener;
