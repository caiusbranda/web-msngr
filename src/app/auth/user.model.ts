import { Chat } from '../chats/chat.model';

export class User {
    constructor(public email: string,
                public password: string,
                public name: string,
                public chats: Chat[],
                public _id: string,
                public friends: User[]) {}
}
