import axios from 'axios';
import {useEffect, useState} from 'react';
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa6';
import {Link} from 'react-router-dom';
import EditDealershipPage from '../EditDealership/EditDealershipPage';
export type Dealer = {
    id: number;
    name: string;
    location: string;
    reviews: number;
};
export default function DealershipPage() {
    const [dealers, setDealers] = useState<Dealer[]>([]);
    const [updateState, setUpdateState] = useState(-1);

    const handleEdit = (dealerId: number) => {
        setUpdateState(dealerId);
    };
    const handleEditingClose = () => {
        setUpdateState(-1);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    'http://localhost:5000/api/dealers',
                );
                setDealers(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [dealers]);
    const handleDelete = async (dealerId: number) => {
        try {
            const res = await axios.delete(
                `http://localhost:5000/api/dealers/delete/${dealerId}`,
            );
            setDealers(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const limit = 5;
    const [page, setPage] = useState(1);
    const indexLast = page * limit;
    const indexFirst = indexLast - limit;
    const currentDealers = dealers.slice(indexFirst, indexLast);

    return (
        <>
            <nav className='navigator'>
                <Link to={'/'}>
                    <button>Cars</button>
                </Link>
                <Link to={'/dealerships'}>
                    <button>Dealerships</button>
                </Link>
            </nav>

            <section>
                <ul>
                    {currentDealers && currentDealers.length > 0
                        ? currentDealers.map((dealer) => {
                              if (updateState === dealer.id) {
                                  return (
                                      <EditDealershipPage
                                          current={dealer}
                                          dealers={dealers}
                                          setDealers={setDealers}
                                          handleEditingClose={
                                              handleEditingClose
                                          }
                                      />
                                  );
                              } else
                                  return (
                                      <li key={dealer.id} className='dealers'>
                                          {dealer.name +
                                              ' ' +
                                              dealer.location +
                                              ' ' +
                                              dealer.reviews}
                                          <button
                                              onClick={() =>
                                                  handleDelete(dealer.id)
                                              }
                                          >
                                              Delete
                                          </button>
                                          <button
                                              onClick={() =>
                                                  handleEdit(dealer.id)
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
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        <FaArrowLeft />
                    </button>
                    <input
                        type='number'
                        value={page}
                        onChange={(e) => {
                            const nextPage = parseInt(e.target.value);
                            if (
                                nextPage >= 1 &&
                                nextPage <=
                                    Math.ceil(currentDealers.length / limit)
                            ) {
                                setPage(nextPage);
                            }
                        }}
                        style={{
                            width: '50px',
                            textAlign: 'center',
                            marginRight: '0.5rem',
                            backgroundColor: 'transparent',
                        }}
                    ></input>
                    <button
                        disabled={indexLast > currentDealers.length}
                        onClick={() => setPage(page + 1)}
                    >
                        <FaArrowRight />
                    </button>
                </div>
                <div className='adder'>
                    <Link to={'/dealership/add'}>
                        <button>Add</button>
                    </Link>
                </div>
            </section>
        </>
    );
    //build api's
    //to include filter, sorting?
}
