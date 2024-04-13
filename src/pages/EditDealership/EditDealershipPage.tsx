import axios from 'axios';
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
    const handleInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const index = dealers.findIndex((dealer) => dealer.id === current.id);
        if (index === -1) return;
        const newDealer = {...dealers[index], [name]: value};
        const newDealers = dealers.map((item) =>
            item.id === current.id ? {...item, [name]: value} : item,
        );
        if (hasDuplicateDealers(newDealers)) return;

        const fetchData = async (id: number) => {
            try {
                await axios.put(
                    `http://localhost:5000/api/dealers/update/${id}`,
                    newDealer,
                );
            } catch (error) {
                console.log('error update car' + error);
            }
        };
        fetchData(current.id);

        setDealers(newDealers);
    };

    const hasDuplicateDealers = (dealers: Dealer[]): boolean => {
        const seenDealers: Set<string> = new Set();

        for (const dealer of dealers) {
            const dealerKey = `${dealer.name}-${dealer.location}-${dealer.reviews}`;
            if (seenDealers.has(dealerKey)) return true;
            seenDealers.add(dealerKey);
        }
        return false;
    };

    return (
        <li key={current.id}>
            <input
                type='text'
                name='name'
                onChange={handleInfo}
                value={current.name}
            />
            <input
                type='text'
                name='location'
                onChange={handleInfo}
                value={current.location}
            />
            <input
                type='number'
                name='reviews'
                onChange={handleInfo}
                value={current.reviews}
                min={1}
                max={5}
                step={0.1}
            />
            <button type='submit' onClick={handleEditingClose}>
                Update
            </button>
        </li>
    );
}
