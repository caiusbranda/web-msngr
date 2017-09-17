import { Chat } from '../chats/chat.model';

export class User {
    constructor(public email: string,
                public password: string,
                public name: String,
                public chats?: Chat[],
                public _id?: String) {}
}
