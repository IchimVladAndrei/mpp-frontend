import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import './axios.config';
import Add from './pages/Add/Add';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/add' element={<Add />} />
                    <Route path='/stats' element={<Stats />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
