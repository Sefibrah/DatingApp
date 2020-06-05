import { Photo } from './photo';
export interface User{
    id: number
    username: string
    gender: string
    age: number
    knownAs: string
    city: string
    country: string
    created: Date
    lastSeen: Date
    photoUrl: string
    introduction?: string
    lookingFor?: string
    interests?: string
    photos?: Photo[]
}