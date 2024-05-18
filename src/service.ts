import axios from 'axios';
import {Dealer} from './pages/Dealership/DealershipPage';
import {Car} from './pages/Home/Home';

export const checkServerService = async () => {
    let serverStatus = true;
    try {
        await axios.get('http://localhost:5000/api/cars/13');
    } catch (error) {
        serverStatus = false;
    }

    return serverStatus;
};
export const checkOnlineService = () => {
    return navigator.onLine;
};
export const syncWithServer = async () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('addDealer')) {
            const record = localStorage.getItem(key);
            if (record) {
                const dealer: Dealer = JSON.parse(record);

                try {
                    await axios.post(
                        'http://localhost:5000/api/dealers/add',
                        dealer,
                    );
                } catch (error) {
                    console.log('error on sync dealers', error);
                }
                localStorage.removeItem(key); //delete here
            }
        } else if (key && key.startsWith('addCar')) {
            const record = localStorage.getItem(key);
            if (record) {
                const car: Car = JSON.parse(record);
                try {
                    await axios.post(
                        'http://localhost:5000/api/cars/addCar',
                        car,
                    );
                } catch (error) {
                    console.log('error on sync cars', error);
                }
                localStorage.removeItem(key); //delete here
            }
        }
    }
    //localstorage.deleteALL
};

export const getUser = () => {
    const record = localStorage.getItem('user');

    if (record) {
        return JSON.parse(record);
    } else {
        return null;
    }
};
export const login = async (email: string, pass: string) => {
    const {data} = await axios.post('http://localhost:5000/api/users/login', {
        email,
        pass,
    });
    localStorage.setItem('user', JSON.stringify(data));

    return data;
};

export const logout = () => {
    localStorage.removeItem('user');
};
export const register = async (newUser) => {
    const {data} = await axios.post(
        'http://localhost:5000/api/users/register',
        newUser,
    );
    localStorage.setItem('user', JSON.stringify(data));
    return data;
};

export const getToken = () => {
    const user = getUser();
    return user ? user.token : null;
};

export const getAccess = async () => {
    const token = getToken();

    if (token) {
        try {
            await axios.get('http://localhost:5000/api/users/admin', {
                headers: {
                    Authorization: token,
                },
            });
            return true;
        } catch (error) {
            console.log('user no rights');
            return false;
        }
    }
    //axios interceptor
};
