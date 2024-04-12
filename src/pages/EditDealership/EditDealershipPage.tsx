import {Dealer} from '../Dealership/DealershipPage';

interface Props {
    current: Dealer;
    dealers: Dealer[];
    setDealers: React.Dispatch<React.SetStateAction<Dealer[]>>;
    handleEditingClose: () => void;
}

export default function EditDealershipPage({
    current,
    dealers,
    setDealers,
    handleEditingClose,
}: Props) {
    return (
        <li>
            <input
                type='text'
                name='name'
                onChange={() => console.log('implement')}
                value={current.name}
            />
            <input
                type='text'
                name='location'
                onChange={() => console.log('implement')}
                value={current.location}
            />
            <input
                type='number'
                name='reviews'
                onChange={() => console.log('implement')}
                value={current.reviews}
            />
            <button type='submit' onClick={handleEditingClose}>
                Update
            </button>
        </li>
    );
}
