import axios from 'axios';
import {useEffect, useState} from 'react';

const ServerDetector = (props: {children: JSX.Element | null}) => {
    const [serverStatus, setServerStatus] = useState(true);
    useEffect(() => {
        const checkServer = async () => {
            try {
                await axios.get('http://localhost:5000/api/cars/1');
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
        <>
            {serverStatus ? (
                props.children
            ) : (
                <div>
                    <h1>Server is down</h1>
                    <h4>Please restart the server</h4>
                </div>
            )}
        </>
    );
};
export default ServerDetector;
