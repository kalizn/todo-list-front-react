

export type ToDoCreate = {
    idUser: number,
    title: string,
    description: string,
    priorityId: number,
    finalDate: string
}

export type ToDoUpdate = {
    idUser: number,
    title: string,
    description: string,
    priorityId: number
    id: number
    finalDate: string
}

export type ToDoModel = {
    created_at: string,
    description: string,
    finally_at: string,
    finalDate: string
    id: number,
    idUser: number,
    priorityId: number,
    priorityName: string,
    title: string,
    updated_at: string
}

export type ToDoModelCustom = {
    created_at: string,
    description: string,
    finally_at: string,
    finalDate: string
    finalDateOriginal: string,
    id: number,
    idUser: number,
    priorityId: number,
    priorityName: string,
    title: string,
    updated_at: string
}


