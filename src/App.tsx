import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import './axios.config';
import ServerDetector from './components/ServerDetector/ServerDetector';
import NetDetector from './components/netDetector/netDetector';
import Add from './pages/Add/Add';
import AddDealershipPage from './pages/AddDealership/AddDealershipPage';
import DealershipPage from './pages/Dealership/DealershipPage';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
function App() {
    return (
        <>
            <NetDetector>
                <ServerDetector>
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/add' element={<Add />} />
                            <Route path='/stats' element={<Stats />} />
                            <Route
                                path='/dealerships'
                                element={<DealershipPage />}
                            />
                            <Route
                                path='/dealership/add'
                                element={<AddDealershipPage />}
                            />
                        </Routes>
                    </BrowserRouter>
                </ServerDetector>
            </NetDetector>
        </>
    );
}

export default App;
