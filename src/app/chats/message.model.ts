import { User } from '../auth/user.model';

export class Message {
    constructor(
        public contentText: string,
        public author: User
    ) {}
}
