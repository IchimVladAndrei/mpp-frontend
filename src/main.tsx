import ReactDOM from 'react-dom/client';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import App from './App.tsx';
import {AuthProvider} from './hooks/useAuth.tsx';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <App />
        <ToastContainer
            position='bottom-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='dark'
        />
    </AuthProvider>,
);
