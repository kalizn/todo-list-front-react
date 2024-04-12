import { Error } from "src/types/error.type";
import { UserToCreate } from "src/types/user.type";

export const validateCreateUser = (data: UserToCreate) => {
    const errors: Error = {}

    if (!data.name) {
        errors['name'] = "O nome do usuário é obrigatório!"
    }

    if (data.name.length < 4) {
        errors['lengthName'] = "O tamanho do nome do usuário é inválido! Deve ter no mínimo 4 Caracteres"
    }

    return errors
}