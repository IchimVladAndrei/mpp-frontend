import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import './axios.config';
import DealerCarPage from './components/DealerCarPage';
import Header from './components/Header/Header';
import NetDetector from './components/netDetector/netDetector';
import Add from './pages/Add/Add';
import AddDealershipPage from './pages/AddDealership/AddDealershipPage';
import DealershipPage from './pages/Dealership/DealershipPage';
import Home from './pages/Home/Home';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import Stats from './pages/Stats/Stats';
function App() {
    return (
        <>
            <NetDetector>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route
                            path='/viewDealer/:id'
                            Component={DealerCarPage}
                        />
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
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/register' element={<RegisterPage />} />
                    </Routes>
                </BrowserRouter>
            </NetDetector>
        </>
    );
}

export default App;
