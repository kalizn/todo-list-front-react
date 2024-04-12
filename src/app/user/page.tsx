'use client'

// React & Next Import
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Api Impot
import UserApi from 'src/api/user/UserApi';

// Error Import
import { validateCreateUser } from 'src/errors/create-user.errors';

// Type Import
import { UserToCreate } from 'src/types/user.type';

// Util Import
import { Alerts } from 'src/utils/Alerts';
import { useSession } from 'src/utils/SessionProvider';

const User = () => {
    // ** State
    const [values, setValues] = useState<string>('');
    const [idGoogle, setIdGoogle] = useState<string>('');
    const [errors, setErrors] = useState<any>(null);

    // ** Hooks
    const { credential } = useSession();
    const alert = new Alerts();
    const api = new UserApi();
    const router = useRouter();

    const handleChange = (event: any) => {
        const newValue = event.target.value;
        setValues(newValue);
    };

    const handleSave = async () => {
        try {
            setErrors(null);

            const body: UserToCreate = {
                name: values,
                idGoogle: idGoogle,
            }

            const validateErrors = validateCreateUser(body);

            if (Object.keys(validateErrors).length > 0) {
                setErrors(validateErrors)

                await alert.errorInputsFields();

                return
            }

            const response = await api.postUser(body);

            if (response.status === 201) {
                await alert.successAlert("O usuário foi cadastrado");
                await alert.moveAlert("da sua lista");
                router.push("/todo");
            } else {
                await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\n Erro: ${response.responses}`);
                return;
            }

        } catch (error) {
            await alert.errorAlert(`Ocorreu algo inesperado, tente novamente mais tarde.\nErro: ${error}`)
            return
        }
    }

    useEffect(() => {
        if (credential) {
            setIdGoogle(credential);
        }
    }, [credential]);

    return (
        <div className='min-h-screen w-full flex flex-col items-center justify-center'>
            <h1 className='mb-4 text-xl'>Insira seu nome</h1>
            <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()} className='flex flex-col items-center'>
                <input
                    value={values}
                    onChange={handleChange}
                    className='rounded-lg px-4 py-2 border border-gray-300 mb-4'
                    placeholder='Seu nome'
                />
                {errors?.name && <small style={{ color: 'red', fontWeight: 'bold' }}>{errors.name}</small>}
                {errors?.lengthName && <small style={{ color: 'red', fontWeight: 'bold' }}>{errors.lengthName}</small>}
                <button
                    onClick={handleSave}
                    className='bg-gray-300 text-gray-700 rounded-lg px-4 py-2 transition duration-300 hover:bg-gray-300 focus:outline-none focus:bg-gray-300'
                >
                    Enviar
                </button>
            </form>

        </div>
    );
};

export default User;
