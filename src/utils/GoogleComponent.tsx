'use client'

// React & Next Import
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Dependency Import
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// Api Import
import UserApi from 'src/api/user/UserApi';

// Custom Notification Import
import { Alerts } from './Alerts';
import { useSession } from './SessionProvider';

const GoogleComponent = () => {
    //
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)

    // Hooks
    const api = new UserApi();
    const alert = new Alerts();
    const router = useRouter();
    const clientId = '';
    const { saveSession } = useSession();

    const responseMessage = async (response: any) => {
        try {
            if (response.credential) {
                const decoded = jwtDecode(response.credential)
                if (decoded.sub) {
                    saveSession(decoded.sub);

                    const responsed = await api.getUser(decoded.sub);

                    if (responsed.status === 200) {
                        await alert.moveAlert('a sua lista');
                        handleMove('/todo')
                    } else if (responsed.status === 203) {
                        await alert.moveAlert('adicionar seu nome personalizado');
                        handleMove('/user')
                    } else {
                        await alert.errorAlert(`Ocorreu um erro inesperado, tente novamente mais tarde.\nErro: ${responsed.responses.data}`);
                        return;
                    }
                }
            } else {
                await alert.errorAlert(`Ocorreu um erro inesperado, tente novamente mais tarde.\nErro: Não foi possível se comunicar com o google`);
                return;
            }
        } catch (error) {
            await alert.errorAlert(`Ocorreu um erro inesperado, tente novamente mais tarde.\nErro: ${error}`);
            return;
        }
    };

    const handleMove = (url?: string) => {
        if (url) {
            router.push(url)
        }
        setAnchorEl(null)
    }

    return (
        clientId !== undefined ? (
            <>
                <GoogleOAuthProvider clientId={clientId}>
                    <GoogleLogin
                        onSuccess={responseMessage}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </GoogleOAuthProvider>
            </>
        ) : null
    );
};

export default GoogleComponent;
