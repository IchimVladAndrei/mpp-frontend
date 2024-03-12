import {useState} from 'react';
import './App.css';
import Cars from './data';

function App() {
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [yearBought, setYearBought] = useState<number>(0);
    const [cars, setCars] = useState(Cars);
    const handleDelete = (id: number) => {
        const newCars = cars.filter((car) => car.id !== id);
        setCars(newCars);
        console.log(newCars);
        //history('/');
    };

    const handleAdd = () => {
        const uniqueId = cars.length ? cars[cars.length - 1].id + 1 : 1;
        const newCar = {id: uniqueId, brand, price, yearBought};
        setCars([...cars, newCar]);
        console.log(newCar);
        //history('/');
    };
    return (
        <>
            <div>
                <ul>
                    {cars && cars.length > 0
                        ? cars.map((item) => {
                              return (
                                  <li key={item.id}>
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
                                          onClick={() => console.log('edit')}
                                      >
                                          Edit
                                      </button>
                                  </li>
                              );
                          })
                        : 'No data found'}
                </ul>
                <div>
                    <label>
                        Brand{' '}
                        <input
                            type='text'
                            name='myBrand'
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </label>
                    <label>
                        Price{' '}
                        <input
                            type='number'
                            name='myPrice'
                            onChange={(e) => setPrice(e.target.valueAsNumber)}
                        />
                    </label>
                    <label>
                        Year{' '}
                        <input
                            type='number'
                            name='myYear'
                            onChange={
                                (e) => setYearBought(e.target.valueAsNumber)
                                //may want to check if the input isNaN
                            }
                        />
                    </label>
                    <button onClick={handleAdd}>Add</button>
                </div>
            </div>
        </>
    );
}

export default App;
//validare date - logice,teste
