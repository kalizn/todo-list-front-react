'use client'

// React & Next Import
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface SessionContextProps {
    credential: string | null;
    saveSession: (id: string) => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {

    // Hooks 
    const router = useRouter();

    useEffect(() => {
        const checkUserSession = () => {
            const lastActivityTime = localStorage.getItem('lastActivityTime');

            if (lastActivityTime) {
                const currentTime = new Date().getTime();
                const elapsedTime = currentTime - parseInt(lastActivityTime, 10);

                if (elapsedTime > 20 * 60 * 1000) {
                    // Session has expired, clear localStorage and log the user out
                    removeSession();
                }
            }
        }

        const setUserActivity = () => {
            // Set the last activity time in localStorage
            localStorage.setItem('lastActivityTime', new Date().getTime().toString());
        };

        // Check session on page load
        checkUserSession();

        // Set up interval to check session every minute
        const sessionInterval = setInterval(checkUserSession, 60 * 1000);

        // Set up event listener to update last activity time on user activity
        window.addEventListener('mousemove', setUserActivity);
        window.addEventListener('keydown', setUserActivity);

        // Clear interval and remove event listeners on component unmount
        return () => {
            clearInterval(sessionInterval);
            window.removeEventListener('mousemove', setUserActivity);
            window.removeEventListener('keydown', setUserActivity);
        };
    }, []);

    const checkSessionStorage = (): string | null => {
        if (typeof window !== 'undefined') {
            const credentialString = sessionStorage.getItem('credential');
             return credentialString;
        }

        return null;
    };

    const [credential, setCredential] = useState<string | null>(checkSessionStorage());

    useEffect(() => {
        if (!credential) {
            handleMove()
        }
    }, [credential])

    const saveSession = (id: string) => {
        setCredential(id);
        sessionStorage.setItem('credential', id);
    }

    const handleMove = async () => {
        router.push('/'); 
    }

    const removeSession = () => {
        setCredential(null)
        const keysSessionStorage = Object.keys(sessionStorage);

        keysSessionStorage.forEach(key => {
            sessionStorage.removeItem(key);
        });

    }

    return (
        <SessionContext.Provider value={{ credential, saveSession }}>
      {children}
    </SessionContext.Provider>
    )

}

export const useSession = (): SessionContextProps => {
    const context = useContext(SessionContext);
    if (!context) {
      throw new Error('useSession deve ser usado dentro de um SessionProvider');
    }
  
    return context;
  };