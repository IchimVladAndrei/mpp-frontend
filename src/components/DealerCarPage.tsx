import axios from 'axios';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Car} from '../pages/Home/Home';

export default function DealerCarPage() {
    const {id} = useParams();
    const [cars, setCars] = useState<Car[]>([
        //{id: 0, brand: 'Abrand', price: 20, yearBought: 1999},
    ]);
    const [allCarsLoaded, setAllCarsLoaded] = useState(false);
    const [page, setPage] = useState(1);

    const fetchCars = async () => {
        try {
            const resp = await axios.get(
                `http://localhost:5000/api/dealers/fetch/${id}/cars`,
                {params: {page: page}},
            );
            //maybe also get the name of the dealer?
            if (resp.data.length === 0) setAllCarsLoaded(true);
            else {
                setCars((prevCars) => [...prevCars, ...resp.data]);
                console.log('data set ', page);
            }
        } catch (error) {
            console.error('Error fetching cars ', error);
        }
    };

    const fetchDealerName = async () => {
        try {
            const aName = await axios.get(
                `http://localhost:5000/api/dealers/${id}`,
            );
            setDealerName(aName.data.name);
        } catch (error) {
            console.error(error);
        }
    };

    const handleScroll = (e) => {
        const {scrollTop, scrollHeight, clientHeight} = e.target;
        const position = Math.ceil(
            (scrollTop / (scrollHeight - clientHeight)) * 100,
        );
        if (position === 100 && !allCarsLoaded) {
            setPage((prevPage) => prevPage + 1);
            //fetchCars();
        }
        //al 3 lea item la fel din cauza la pagina pe care o preia modify query
        //fix issue with duplicate item.key
    };
    const [dealerName, setDealerName] = useState('');
    useEffect(() => {
        fetchDealerName();
        //fetchCars();
    }, []);
    useEffect(() => {
        fetchCars();
    }, [page]);

    return (
        <>
            <h2>Welcome to dealer {dealerName}</h2>
            <div
                onScroll={handleScroll}
                style={{
                    height: '300px', /// aici pune mai mic sau mai mare ca sa mearga scrollu
                    overflowY: 'scroll',
                    border: '1px solid #ccc',
                    width: 'auto',
                }}
            >
                <ul style={{fontSize: '5rem'}}>
                    {cars && cars.length > 0
                        ? cars.map((item) => (
                              <li key={item.id} className='cars'>
                                  {item.brand +
                                      ' ' +
                                      item.price +
                                      'K' +
                                      ' ' +
                                      item.yearBought}
                              </li>
                          ))
                        : 'No data found'}
                </ul>
                {allCarsLoaded && (
                    <>
                        <p>eof</p> <p> {page}</p>{' '}
                    </>
                )}
            </div>
        </>
    );
}
