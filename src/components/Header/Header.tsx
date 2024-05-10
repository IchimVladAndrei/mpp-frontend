import {Link} from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth';
import './Header.css';

export default function Header() {
    const {user, logout} = useAuth();

    return (
        <header>
            <div className='header-container'>
                <Link to='/' className='company-name'>
                    TheCompany
                </Link>

                <nav>
                    <div>
                        {user ? (
                            <div className='user-info'>
                                <span>Welcome, {user.name}</span>
                                <button onClick={logout} className='logout-btn'>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to='/login'>
                                <button>Login</button>
                            </Link>
                        )}
                        <Link to={'/'}>
                            <button>Cars</button>
                        </Link>
                        <Link to={'/dealerships'}>
                            <button>Dealerships</button>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
