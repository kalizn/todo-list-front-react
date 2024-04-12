import { Error } from "src/types/error.type";
import { ToDoCreate } from "src/types/todo.type";

export const validateCreateTodo = (data: ToDoCreate) => {
    const errors: Error = {}

    if (!data.title) {
        errors['title'] = "O título é obrigatório!"
    }

    if (data.title.length < 4) {
        errors['lengthTitle'] = "O tamanho do título é inválido! Deve ter no mínimo 4 Caracteres";
    }

    if (!data.description) {
        errors['description'] = "A descrição é obrigatória!";
    }

    if (data.title.length < 4) {
        errors['lengtDescription'] = "O tamanho da descrição é inválido! Deve ter no mínimo 4 Caracteres";
    }

    if (!data.priorityId) {
        errors['priorityId'] = "Você deve selecionar uma prioridade";
    }

    return errors
}