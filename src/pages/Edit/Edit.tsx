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
        const newCars = cars.map((item) =>
            item.id === current.id ? {...item, [name]: value} : item,
        );
        if (hasDuplicateCars(newCars)) return;
        setCars(newCars);
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
