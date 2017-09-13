import { Message } from './message-list/message/message.model';

import { User } from '../auth/user.model';

export class Chat {
    constructor(
        public users: User[],
        public messages: Message[],
        public chatId?: string) {}

}
