import axios from "axios"
import { UserToCreate, UserToUpdate } from "src/types/user.type"

export default class PriorityApi {
    [x: string] : any
    constructor(private readonly url: string | undefined = process.env.NEXT_PUBLIC_API) {}

    async getTodoList() {
        try {
            const returned = await axios.get(`${this.url}priority/`)

            return { status: returned.status, responses: returned.data }
        } catch (error) {
            return { status: 500, responses: "Internal Error" }
        }
    }

}