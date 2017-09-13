import { Chat } from '../chats/chat.model';

export class User {
    constructor(public email: string,
                public password: string,
                public chats?: Chat[],
                public firstName?: string,
                public lastName?: string) {}
}
