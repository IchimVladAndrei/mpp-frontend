import {useState} from 'react';
import './App.css';
import Cars from './data';

/**
 * can add duplicates --cant
 * can add invalid data (when are empty, have same price and year) ---cant
 * can edit to obtain invalid data
 */

function App() {
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [yearBought, setYearBought] = useState<number>(0);
    const [cars, setCars] = useState(Cars);
    const [updateState, setUpdateState] = useState(-1);

    const handleEditing = (id: number) => {
        setUpdateState(id);
    };

    const handleEditingClose = () => {
        setUpdateState(-1);
    };

    const handleDelete = (id: number) => {
        const newCars = cars.filter((car) => car.id !== id);
        setCars(newCars);
        console.log(newCars);
    };

    const handleAdd = () => {
        const uniqueId = cars.length ? cars[cars.length - 1].id + 1 : 1;
        const isValid = checkPropsCar(brand, price, yearBought);
        if (!isValid) return;
        const newCar = {id: uniqueId, brand, price, yearBought};
        setCars([...cars, newCar]);
        console.log(newCar);
    };

    const checkPropsCar = (
        brand: string,
        price: number,
        yearBought: number,
    ) => {
        if (price < 1) return false;
        if (yearBought < 1903) return false;
        if (brand.length < 4) return false;

        return !cars.some(
            (car) => car.price == price && car.yearBought === yearBought,
        );
    };

    return (
        <>
            <div>
                <ul>
                    {cars && cars.length > 0
                        ? cars.map((item) => {
                              if (updateState === item.id) {
                                  return (
                                      <Edit
                                          current={item}
                                          cars={cars}
                                          setCars={setCars}
                                          handleEditingClose={
                                              handleEditingClose
                                          }
                                      />
                                  );
                              } else
                                  return (
                                      <li key={item.id}>
                                          {item.brand +
                                              ' ' +
                                              item.price +
                                              'K' +
                                              ' ' +
                                              item.yearBought}
                                          <button
                                              onClick={() =>
                                                  handleDelete(item.id)
                                              }
                                          >
                                              Delete
                                          </button>
                                          <button
                                              onClick={() =>
                                                  handleEditing(item.id)
                                              }
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
                            placeholder='enter brand...'
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </label>
                    <label>
                        Price{' '}
                        <input
                            type='number'
                            name='myPrice'
                            placeholder='enter price...'
                            onChange={(e) => setPrice(e.target.valueAsNumber)}
                        />
                    </label>
                    <label>
                        Year{' '}
                        <input
                            type='number'
                            name='myYear'
                            placeholder='enter year bought...'
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

interface Props {
    current: {
        id: number;
        brand: string;
        price: number;
        yearBought: number;
    };
    cars: {
        id: number;
        brand: string;
        price: number;
        yearBought: number;
    }[];
    setCars: React.Dispatch<
        React.SetStateAction<
            {
                id: number;
                brand: string;
                price: number;
                yearBought: number;
            }[]
        >
    >;
    handleEditingClose: () => void;
}
function Edit({current, cars, setCars, handleEditingClose}: Props) {
    const handleInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCars = cars.map((item) =>
            item.id === current.id
                ? {...item, [e.target.name]: e.target.value}
                : item,
        );
        //if (hasDuplicateCars(newCars)) return;
        setCars(newCars);
    };

    return (
        <li>
            <input
                type='text'
                name='brand'
                onChange={handleInfo}
                value={current.brand}
            />
            <input
                type='number'
                name='price'
                onChange={handleInfo}
                value={current.price}
            />
            <input
                type='number'
                name='yearBought'
                onChange={handleInfo}
                value={current.yearBought}
            />
            <button type='submit' onClick={handleEditingClose}>
                Update
            </button>
        </li>
    );
}
export default App;
//validare date - logice,teste
