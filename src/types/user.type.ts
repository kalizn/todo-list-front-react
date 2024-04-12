export type UserToCreate = {
    name: string
    idGoogle: string
}

export type UserToUpdate = {
    name: string
    id: number
}

export type UserModel = {
    id: number
    idGoogle: string
    name: string
}