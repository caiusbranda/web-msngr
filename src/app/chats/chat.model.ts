import { Message } from './message.model';
import { User } from '../auth/user.model';

export class Chat {
    constructor(
        public users: User[],
        public messages: Message[]) {}
}
