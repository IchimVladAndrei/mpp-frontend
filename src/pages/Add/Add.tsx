import {useState} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import Cars from '../../data';
export default function Add() {
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState(0);
    const [yearBought, setYearBought] = useState(0);
    const hist = useNavigate();
    const handleAdd = () => {
        const uniqueId = Cars.length ? Cars[Cars.length - 1].id + 1 : 1;
        const isValid = checkPropsCar(brand, price, yearBought);
        if (!isValid) {
            alert('Invalid input');
            return;
        }
        const newCar = {id: uniqueId, brand, price, yearBought};
        //setCars([...cars, newCar]);
        Cars.push(newCar);
        console.log(newCar);
        hist('/');
    };
    const checkPropsCar = (
        brand: string,
        price: number,
        yearBought: number,
    ) => {
        if (price < 1) return false;
        if (yearBought < 1903) return false;
        if (brand.length < 3) return false;

        return !Cars.some(
            (car) =>
                car.brand === brand &&
                car.price === price &&
                car.yearBought === yearBought,
        );
    };
    return (
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
                    min={1}
                    name='myPrice'
                    placeholder='enter price...'
                    onChange={(e) => setPrice(e.target.valueAsNumber)}
                />
            </label>
            <label>
                Year{' '}
                <input
                    type='number'
                    min={2000}
                    name='myYear'
                    placeholder='enter year bought...'
                    onChange={(e) => setYearBought(e.target.valueAsNumber)}
                />
            </label>

            <Button type='submit' onClick={handleAdd}>
                Submit
            </Button>
        </div>
    );
}
