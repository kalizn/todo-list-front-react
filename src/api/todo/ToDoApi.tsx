// Dependency Import
import axios from "axios"

// Type Import
import { ToDoCreate, ToDoUpdate } from "src/types/todo.type"

export default class ToDoApi {
    [x: string] : any
    constructor(private readonly url: string | undefined = process.env.NEXT_PUBLIC_API) {}

    async postTodo(body: ToDoCreate) {
        try {
            const returned = await axios.post(`${this.url}todo`, body)

            return { status: returned.status, responses: returned.data }
        } catch (error) {
            return { status: 500, responses: "Internal Error" }
        }
    }

    async putTodo(body: ToDoUpdate) {
        try {
            const returned = await axios.put(`${this.url}todo`, body)

            console.log(returned)
            return { status: returned.status, responses: returned.data }
        } catch (error) {
            console.log(error)
            return { status: 500, responses: "Internal Error" }
        }
    }

    async getTodoList(id: string) {
        try {
            const returned = await axios.get(`${this.url}todo/${id}`)

            return { status: returned.status, responses: returned.data }
        } catch (error) {
            return { status: 500, responses: "Internal Error" }
        }
    }

    async patchTodo(id: string, idUser: string) {
        try {
            const returned = await axios.patch(`${this.url}todo/${id}/${idUser}`)

            return { status: returned.status, responses: returned.data }
        } catch (error) {
            return { status: 500, responses: "Internal Error" }
        }
    }

    async deleteTodo(id: string, idUser: string) {
        try {
            const returned = await axios.delete(`${this.url}todo/${id}/${idUser}`)

            return { status: returned.status, responses: returned.data }
        } catch (error) {
            return { status: 500, responses: "Internal Error" }
        }
    }

}