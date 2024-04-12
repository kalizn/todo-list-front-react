'use client'

// React & Next Import
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

// Api Import
import ToDoApi from 'src/api/todo/ToDoApi'
import UserApi from 'src/api/user/UserApi'

// Type Import
import { ToDoModel } from 'src/types/todo.type'
import { UserModel } from 'src/types/user.type'

// Util Import
import { Alerts } from 'src/utils/Alerts'
import { useSession } from 'src/utils/SessionProvider'
import ModalCustom from 'src/utils/CustomModal'

// Component Import
import EditTodo from './edit/page'

// Dependency Import
import { format } from 'date-fns'

const TodoPage = () => {
  // ** States
  const [user, setUser] = useState<UserModel | null>(null)
  const [credentialReceived, setCredentialReceived] = useState<string | null>(null)
  const [list, setList] = useState<ToDoModel[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [taskSelected, setTaskSelected] = useState<any>(null)
  const [selectedId, setSelectedId] = useState<any>(null)
  const [isModalDelete, setIsModalDelete] = useState<boolean>(false)
  const [isModalFinal, setIsModalFinal] = useState<boolean>(false)

  //Hooks
  const { credential } = useSession();
  const alert = new Alerts();
  const apiUser = new UserApi();
  const apiTodo = new ToDoApi();
  const router = useRouter();

  const getUser = async (id: string) => {
    try {
      const response = await apiUser.getUser(id);

      if (response.status === 200) {
        setUser(response.responses)
        getList(response.responses.id)
      } else if (response.status === 203) {
        await alert.errorAlert(`Usuário não encontrado.`);
        return
      } else {
        await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\nErro: ${response.responses}`);
      }


    } catch (error) {
      await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\nErro: ${error}`);
      return
    }
  }

  const getList = async (id: string) => {
    try {

      const response = await apiTodo.getTodoList(id);

      if (response.status === 200) {

        // Formatando os dados recebidos para incluir priorityName
        const formattedData = response.responses.map((task: any) => ({
          ...task,
          created_at: format(new Date(task.created_at), 'dd/MM/yyyy'),
          updated_at: format(new Date(task.updated_at), 'dd/MM/yyyy'),
          finalDate: task.finalDate ? format(new Date(new Date(task.finalDate).getTime() + (24 * 60 * 60 * 1000)), 'dd/MM/yyyy') : null,
          finalDateOriginal: task.finalDate,
          finally_at: task.finally_at ? format(new Date(task.finally_at), 'dd/MM/yyyy') : null,
          priorityName: task.priority ? task.priority.name : "Sem Prioridade",
        }));

        setList(formattedData);
      } else {
        await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\n ${response.responses}`);
        return;
      }

    } catch (error) {
      await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\n ${error}`);
      return;
    }
  }

  const handleMove = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const handleEditTask = (task: any) => {
    setTaskSelected(task);
    setIsEdit(true);
  }

  const handleCloseEditTask = () => {
    if (user) {
      setIsEdit(false);
      getList(user.id.toString());
    }
  }

  const handleOpenFinal = (id: number) => {
    setSelectedId(id);
    setIsModalFinal(true);
  }

  const handleCloseFinal = () => {
    setSelectedId(0);
    setIsModalFinal(false);
  }

  const handleOpenDelete = (id: number) => {
    setSelectedId(id);
    setIsModalDelete(true);
  }

  const handleCloseDelete = () => {
    setSelectedId(0);
    setIsModalDelete(false);
  }

  const handleFinalSend = async () => {
    try {
      if (user && selectedId) {
        const response = await apiTodo.patchTodo(selectedId, user.id.toString())

        if (response.status === 200) {
          handleCloseFinal()
          getList(user.id.toString())
          await alert.successAlert(`Foi finalizada a tarefa`);

        } else if (response.status === 203) {
          handleCloseFinal()
          await alert.errorAlert(`Não foi encontrada uma tarefa`);
          return;
        } else {
          setIsModalFinal(false);
          await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\n ${response.responses}`);
          setIsModalFinal(true);
          return;
        }
      }
    } catch (error) {
      await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\n ${error}`);
      return;
    }
  }

  const handleDeleteSend = async () => {
    try {
      if (user && selectedId) {
        const response = await apiTodo.deleteTodo(selectedId, user.id.toString())

        if (response.status === 200) {
          handleCloseDelete()
          getList(user.id.toString())
          await alert.successAlert(`A tarefa foi deletada com sucesso.`);

        } else if (response.status === 203) {
          handleCloseDelete()
          await alert.errorAlert(`Não foi encontrada uma tarefa`);
          return;
        } else {
          setIsModalDelete(false);
          await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\n ${response.responses}`);
          setIsModalDelete(true);
          return;
        }
      }
    } catch (error) {
      await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\n ${error}`);
      return;
    }
  }

  useEffect(() => {
    if (credential) {
      setCredentialReceived(credential)
    }
  }, [credential])

  useEffect(() => {
    if (credentialReceived !== null) {
      getUser(credentialReceived)
    }
  }, [credentialReceived])

  return (
    !isEdit ?
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <ModalCustom onOpen={isModalFinal} onClose={handleCloseFinal} onYes={handleFinalSend} onNo={handleCloseFinal} title='Você deseja finalizar esta tarefa?' />
        <ModalCustom onOpen={isModalDelete} onClose={handleCloseDelete} onYes={handleDeleteSend} onNo={handleCloseDelete} title='Você deseja deletar esta tarefa?' />
        <h1 className="text-3xl font-bold mb-8 text-center">Bem vindo, {user?.name}</h1>
        <button
          onClick={() => handleMove('/todo/new')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mb-8"
        >
          Nova Tarefa
        </button>
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
          <h2 className="text-xl font-bold mb-4 px-6 py-4 bg-gray-200">Lista de Tarefas</h2>
          <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
            <ul>
              {list.map((task, index) => (
                <li key={index} className="border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex flex-col w-full">
                    <h3 className="font-bold text-lg mb-1">{task.title}</h3>
                    <p className="text-gray-700 mb-1">
                      {task.description && task.description.length > 25 ?
                        task.description.match(/.{1,25}/g).map((line, index) => (
                          <span key={index}>{line}<br /></span>
                        )) :
                        task.description}
                    </p>
                    <p className="text-sm text-gray-600">Prioridade: {task.priorityName}</p>
                    <div>
                      <p className="text-sm text-gray-600">Criado: {task.created_at}</p>
                      <p className="text-sm text-gray-600">Última Edição: {task.updated_at}</p>
                      <p className="text-sm text-gray-600">Data Final: {task.finalDate !== null ? `${task.finalDate}` : 'Não Definido'}</p>
                      <p className="text-sm text-gray-600">Finalizado: {task.finally_at !== null ? `Sim ${task.finally_at}` : 'Não'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex flex-row space-x-4">
                      <button
                        className={`py-2 px-4 rounded ${task.finally_at !== null ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white font-bold'}`}
                        onClick={() => handleOpenFinal(task.id)}
                        disabled={task.finally_at !== null}
                      >
                        Finalizar
                      </button>

                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleEditTask(task)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleOpenDelete(task.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                </li>
              ))}

            </ul>
          </div>
        </div>


      </div>
      : <EditTodo body={taskSelected} close={handleCloseEditTask} />
  );

}

export default TodoPage