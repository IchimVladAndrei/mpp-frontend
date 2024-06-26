import axios from 'axios';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth';

export default function AddDealershipPage() {
    const {access} = useAuth();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [reviews, setReviews] = useState(1.0);
    const hist = useNavigate();

    const handleAdd = async () => {
        if (!access) {
            alert('You dont have the rights ');
            return;
        }
        try {
            await axios.post(
                'https://mpp1-7516832ded6b.herokuapp.com/api/dealers/add',
                {
                    name,
                    location,
                    reviews,
                },
            );
        } catch (error) {
            localStorage.setItem(
                'addDealer' + Math.floor(Math.random() * 100),
                JSON.stringify({
                    name: name,
                    location: location,
                    reviews: reviews,
                }),
            );
            console.log('add dealer error', error);
        }

        hist('/dealerships');
    };

    return (
        <div className='adderDealer'>
            <label>
                Name{' '}
                <input
                    type='text'
                    name='name'
                    placeholder='enter name...'
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                Location{' '}
                <input
                    type='text'
                    name='location'
                    placeholder='enter location...'
                    onChange={(e) => setLocation(e.target.value)}
                />
            </label>
            <label>
                Review{' '}
                <input
                    type='number'
                    name='reviews'
                    placeholder='enter a review...'
                    onChange={(e) => {
                        setReviews(e.target.valueAsNumber);
                    }}
                    min={1}
                    max={5}
                    step={0.1}
                />
            </label>
            <div>
                <button type='submit' onClick={handleAdd}>
                    Submit
                </button>
            </div>
        </div>
    );
}
