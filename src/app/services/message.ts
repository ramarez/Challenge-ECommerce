export interface IMessage {
    type: "Warning" | "Error" | "Success";
    message: string;
}

export class Message {
    static Error(message: string): IMessage {
        return {type: "Error", message};
    }

    static Warning(message: string): IMessage {
        return {type: "Warning", message};
    }

    static Success(message: string): IMessage {
        return {type: "Success", message};
    }
}
