import axios from 'axios';
import {useState} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
export default function Add() {
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState(0);
    const [yearBought, setYearBought] = useState(0);
    const [dealer, setDealer] = useState('');
    const hist = useNavigate();
    const handleAdd = async () => {
        try {
            await axios.post('http://localhost:5000/api/cars/addCar', {
                brand,
                price,
                yearBought,
                dealer,
            });
        } catch (error) {
            localStorage.setItem(
                'addCar' + Math.floor(Math.random() * 100),
                JSON.stringify({
                    brand: brand,
                    price: price,
                    yearBought: yearBought,
                    dealer: dealer,
                }),
            );
            console.log('add player error ', error);
        }

        hist('/');
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
            <label>
                Dealership{' '}
                <input
                    type='text'
                    name='dealer'
                    placeholder='enter the dealership'
                    onChange={(e) => setDealer(e.target.value)}
                />
            </label>
            <Button type='submit' onClick={handleAdd}>
                Submit
            </Button>
        </div>
    );
}
