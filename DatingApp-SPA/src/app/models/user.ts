import { Photo } from './photo';
export class User {
    constructor(
        public id: number,
        public username: string,
        public gender: string,
        public age: number,
        public knownAs: string,
        public city: string,
        public country: string,
        public created: Date,
        public lastSeen: Date,
        public photoUrl: string,
        public introduction?: string,
        public lookingFor?: string,
        public interests?: string,
        public roles?: string[],
        public photos?: Photo[]) { }
}
