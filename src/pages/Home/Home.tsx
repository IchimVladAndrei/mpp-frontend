import axios from 'axios';
import {useEffect, useState} from 'react';
import {
    FaArrowDown,
    FaArrowLeft,
    FaArrowRight,
    FaArrowUp,
} from 'react-icons/fa6';
import {Link} from 'react-router-dom';
import Edit from '../Edit/Edit.tsx';
export default function Home() {
    const [cars, setCars] = useState<Car[]>([]);
    type Car = {
        id: number;
        brand: string;
        price: number;
        yearBought: number;
    };

    const [updateState, setUpdateState] = useState(-1);
    const [searchKey, setSearchKey] = useState(-1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/cars',
                );
                setCars(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleEditing = (id: number) => {
        setUpdateState(id);
    };

    const handleEditingClose = () => {
        setUpdateState(-1);
    };

    const handleDelete = async (id: number) => {
        // const newCars = cars.filter((car) => car.id !== id);
        // setCars(newCars);
        // console.log(newCars);
        try {
            const response = await axios.delete(
                `http://localhost:5000/api/cars/deleteCar/${id}`,
            );
            setCars(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredCars = cars.filter((car) => {
        return car.price > searchKey;
    });

    const [sortOrder, setSortOrder] = useState(false);
    //true- for ascending, false for desc

    const handleSort = () => {
        setSortOrder(!sortOrder);
        const K = sortOrder === true ? -1 : 1;
        const sortedCars = [...cars].sort(
            (a, b) => K * (a.yearBought - b.yearBought),
        );
        setCars(sortedCars);
    };

    const limit = 5;
    const [page, setPage] = useState(1);

    const indexLast = page * limit;
    const indexFirst = indexLast - limit;
    const currentCars = filteredCars.slice(indexFirst, indexLast);

    return (
        <div>
            <ul>
                {currentCars && currentCars.length > 0
                    ? currentCars.map((item) => {
                          if (updateState === item.id) {
                              return (
                                  <Edit
                                      current={item}
                                      cars={cars}
                                      setCars={setCars}
                                      handleEditingClose={handleEditingClose}
                                  />
                              );
                          } else
                              return (
                                  <li key={item.id} className='cars'>
                                      {item.brand +
                                          ' ' +
                                          item.price +
                                          'K' +
                                          ' ' +
                                          item.yearBought}
                                      <button
                                          onClick={() => handleDelete(item.id)}
                                      >
                                          Delete
                                      </button>
                                      <button
                                          onClick={() => handleEditing(item.id)}
                                      >
                                          Edit
                                      </button>
                                  </li>
                              );
                      })
                    : 'No data found'}
            </ul>
            <div>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    <FaArrowLeft />
                </button>
                <input
                    type='number'
                    value={page}
                    onChange={(e) => {
                        const nextPage = parseInt(e.target.value);
                        if (
                            nextPage >= 1 &&
                            nextPage <= Math.ceil(filteredCars.length / limit)
                        ) {
                            setPage(nextPage);
                        }
                    }}
                    style={{
                        width: '50px',
                        textAlign: 'center',
                        marginRight: '0.5rem',
                        backgroundColor: 'transparent',
                    }}
                ></input>
                <button
                    disabled={indexLast >= filteredCars.length}
                    onClick={() => setPage(page + 1)}
                >
                    <FaArrowRight />
                </button>
            </div>
            <div className='adder'>
                <Link to={'/add'}>
                    {' '}
                    <button>Add</button>
                </Link>
            </div>
            <div>
                <label>
                    Filter greater than price{' '}
                    <input
                        type='number'
                        min={1}
                        placeholder='enter min price'
                        onChange={(e) => {
                            const inputValue = e.target.valueAsNumber;
                            setSearchKey(isNaN(inputValue) ? -1 : inputValue);
                        }}
                    ></input>
                </label>
            </div>
            <div>
                <button onClick={handleSort}>
                    Sort by year{' '}
                    {sortOrder === false ? <FaArrowUp /> : <FaArrowDown />}
                </button>
                <Link to={'/stats'}>
                    <button>See Year Stats</button>
                </Link>
            </div>
        </div>
    );
}
