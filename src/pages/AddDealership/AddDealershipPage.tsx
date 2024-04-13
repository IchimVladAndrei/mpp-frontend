import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function AddDealershipPage() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [review, setReview] = useState(1);
    const hist = useNavigate();

    const handleAdd = () => {
        console.log([name, location, review]);
        hist('/dealership');
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
                    onChange={(e) => setReview(e.target.valueAsNumber)}
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
