import axios from "axios"
import { UserToCreate, UserToUpdate } from "src/types/user.type"

export default class UserApi {
    [x: string] : any
    constructor(private readonly url: string | undefined = process.env.NEXT_PUBLIC_API) {}

    async postUser(body: UserToCreate) {
        try {
            const returned = await axios.post(`${this.url}user/`, body)

            return { status: returned.status, responses: returned.data }
        } catch (error) {
            return { status: 500, responses: "Internal Error" }
        }
    }

    async putUser(body: UserToUpdate) {
        try {
            const returned = await axios.put(`${this.url}user`, body)

            return { status: returned.status, responses: returned.data }
        } catch (error) {
            return { status: 500, responses: "Internal Error" }
        }
    }

    async getUser(id: string) {
        try {
            const returned = await axios.get(`${this.url}user/${id}`)

            return { status: returned.status, responses: returned.data }
        } catch (error) {
            return { status: 500, responses: "Internal Error" }
        }
    }

}