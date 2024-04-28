import axios from 'axios';
import {Dealer} from './pages/Dealership/DealershipPage';
import {Car} from './pages/Home/Home';

export const checkServerService = async () => {
    let serverStatus = true;
    try {
        await axios.get('http://localhost:5000/api/cars/1');
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
            }
        }
    }
    localStorage.clear();
};
