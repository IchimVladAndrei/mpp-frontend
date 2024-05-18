import axios from 'axios';

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

export default function Edit({
    current,
    cars,
    setCars,
    handleEditingClose,
}: Props) {
    const handleInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const index = cars.findIndex((item) => item.id === current.id);
        if (index === -1) return;

        const newCar = {...cars[index], [name]: value}; //value = convert to int
        //cars[index] = newCar;

        const newCars = cars.map((item) =>
            item.id === current.id ? {...item, [name]: value} : item,
        );
        if (hasDuplicateCars(newCars)) return;

        const fetchData = async (id: number) => {
            try {
                await axios.put(
                    `https://mpp1-7516832ded6b.herokuapp.com/api/cars/updateCar/${id}`,
                    newCar,
                );
            } catch (error) {
                console.error('error update car ', error);
            }
        };
        fetchData(current.id);

        setCars(newCars); //other way to auto update the edit?
    };

    const hasDuplicateCars = (
        cars: {id: number; brand: string; price: number; yearBought: number}[],
    ): boolean => {
        const seenCars: Set<string> = new Set();

        for (const car of cars) {
            const carKey = `${car.brand}-${car.price}-${car.yearBought}`;

            if (seenCars.has(carKey)) {
                return true;
            }
            seenCars.add(carKey);
        }

        return false;
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
