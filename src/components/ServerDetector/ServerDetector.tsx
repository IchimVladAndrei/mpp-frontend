import axios from 'axios';
import {useEffect, useState} from 'react';

const ServerDetector = (props: {children: JSX.Element | null}) => {
    const [serverStatus, setServerStatus] = useState(true);
    useEffect(() => {
        const checkServer = async () => {
            try {
                await axios.get(
                    'https://mpp1-7516832ded6b.herokuapp.com/api/cars',
                );
                setServerStatus(true);
            } catch (error) {
                console.log(error);
                setServerStatus(false);
            }
        };

        checkServer(); // Call checkServer when the component mounts
        const intervalId = setInterval(checkServer, 5000); // Check server every 5 seconds

        return () => clearInterval(intervalId);
    }, []);
    return (
        <div>
            {!serverStatus && (
                <>
                    <h1>Server is down</h1>
                    <h4>Please restart server</h4>
                </>
            )}
            {props.children}
        </div>
    );
};
export default ServerDetector;
