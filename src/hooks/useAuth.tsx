import {ReactNode, createContext, useContext, useState} from 'react';
import {toast} from 'react-toastify';
import * as userService from '../service';
interface AuthContextType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: (newUserData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState(userService.getUser());

    const login = async (email: string, pass: string) => {
        try {
            const user = await userService.login(email, pass);
            setUser(user);
            toast.success('Login succesful');
        } catch (error) {
            toast.error('Email or passsword is incorrect'); //type unknown
        }
    };

    const register = async (newUserData) => {
        try {
            const user = await userService.register(newUserData);
            setUser(user);
            toast.success('Register Succesful');
        } catch (error) {
            toast.error("Couldn't register");
        }
    };

    const logout = () => {
        userService.logout();
        setUser(null);
        toast.success('Logout succesful');
    };

    return (
        <AuthContext.Provider value={{user, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
