'use client'

// React Import
import React, { useEffect, useState } from 'react';

// Api Import
import PriorityApi from 'src/api/priority/PriorityApi';
import ToDoApi from 'src/api/todo/ToDoApi';

// Error Import
import { validateUpdateTodo } from 'src/errors/update-todo.errors';

// Type Import
import { PriorityModel } from 'src/types/priority.type';
import { ToDoModelCustom, ToDoUpdate } from 'src/types/todo.type';

// Util Import
import { Alerts } from 'src/utils/Alerts';
import { useSession } from 'src/utils/SessionProvider';


interface MyProps {
  body: ToDoModelCustom,
  close: () => void
}

interface Dropdown {
  value: string,
  label: string
}

const EditTodo: React.FC<MyProps> = ({ body, close }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [credentialReceived, setCredentialReceived] = useState<string | null>(null)
  const [priorityList, setPriorityList] = useState<Dropdown[]>([]);
  const [errors, setErrors] = useState<any>(null)
  const [finalDate, setFinalDate] = useState('');

  // ** Hooks
  const { credential } = useSession();
  const apiPriority = new PriorityApi();
  const apiTodo = new ToDoApi();
  const alert = new Alerts();

  const getPriority = async () => {
    try {
      const response = await apiPriority.getTodoList();

      if (response.status === 200) {
        const formattedData = response.responses.map((order: PriorityModel) => ({
          value: order.id,
          label: order.name
        }))

        setPriorityList(formattedData)
      }
    } catch (error) {
      await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\nErro: ${error}`);
      return;
    }
  }

  const handleFinalDateChange = (e: any) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      // Se a data selecionada for menor que a data atual, defina a data atual como valor
      setFinalDate(currentDate.toISOString().substr(0, 10)); // Formato ISO 8601 para data (YYYY-MM-DD)
    } else {
      setFinalDate(e.target.value);
    }
  };

  const handleSave = async () => {
    try {
      setErrors(null);

      const newId = body.id.toString();

      const bodyToSend: ToDoUpdate = {
        idUser: body.idUser,
        title: title,
        description: description,
        priorityId: parseInt(priority),
        finalDate: finalDate.toString(),
        id: parseInt(newId)
      }
      console.log(bodyToSend)

      const validateErrors = validateUpdateTodo(bodyToSend);

      if (Object.keys(validateErrors).length > 0) {
        setErrors(validateErrors)

        await alert.errorInputsFields();

        return
      }

      console.log('antes')
      const response = await apiTodo.putTodo(bodyToSend);

      if (response.status === 200) {
        await alert.successAlert("Tarefa atualizada com sucesso.");
        close()
      } else if (response.status === 203) {
        await alert.errorAlert(`Não foi possível encontrar esta tarefa`);
        close()
        return;
      } else {
        await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\n Erro: ${response.responses}`);
        return;
      }

    } catch (error) {
      await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\n Erro: ${error}`);
      return;
    }
  }

  useEffect(() => {
    if (credential) {
      setCredentialReceived(credential);
    }
  }, [credential])

  useEffect(() => {
    if (credentialReceived) {
      getPriority()
      setTitle(body.title)
      setDescription(body.description)
      console.log(body)
      setFinalDate(body.finalDateOriginal)
      setPriority(body.priorityId.toString())
    }
  }, [credentialReceived])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className='text-center text-gray-700 font-bold mb-2'>Edição de tarefa</h1>
        <form className="flex flex-col space-y-4" noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
              Título:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Digite o título da tarefa"
              required
            />
            {errors?.title && <small style={{ color: 'red', fontWeight: 'bold' }}>{errors.title}</small>}
            {errors?.lengthTitle && <small style={{ color: 'red', fontWeight: 'bold' }}>{errors.lengthTitle}</small>}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
              Descrição:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
              placeholder="Digite a descrição da tarefa"
              required
            ></textarea>
            {errors?.description && <small style={{ color: 'red', fontWeight: 'bold' }}>{errors.description}</small>}
            {errors?.lengtDescription && <small style={{ color: 'red', fontWeight: 'bold' }}>{errors.lengtDescription}</small>}
          </div>
          <div className="mb-4">
            <div className='flex justify-between'>
              <div style={{ width: '45%', marginRight: '5%' }}> {/* Define a largura como 45% e margem à direita de 5% */}
                <label htmlFor="priority" className="block text-gray-700 font-bold mb-2">
                  Prioridade:
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="" disabled>
                    Selecione a prioridade
                  </option>
                  {priorityList.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ width: '45%' }}> {/* Define a largura como 45% */}
                <label htmlFor="finalDate" className="block text-gray-700 font-bold mb-2">
                  Data final:
                </label>
                <input
                  id="finalDate"
                  value={finalDate}
                  type='date'
                  onChange={handleFinalDateChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {errors?.priorityId && <small style={{ color: 'red', fontWeight: 'bold' }}>{errors.priorityId}</small>}
          </div>
          <div className="flex justify-between">
            <button
              onClick={close}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Voltar
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Editar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default EditTodo;
