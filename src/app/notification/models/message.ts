import { MessageType } from "./message-type.enum";

export class Message {
    id?: string;
    type?: MessageType;
    message?: string;
    autoClose?: boolean;
    keepAfterRouteChange?: boolean;
    fade?: boolean;
    header?: string;

    constructor(init?:Partial<Message>) {
        Object.assign(this, init);
    }
}
