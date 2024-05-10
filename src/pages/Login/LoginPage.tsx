import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import Input from '../../components/Input/Input';
import {useAuth} from '../../hooks/useAuth';

export default function LoginPage() {
    const {
        handleSubmit,
        register,
        formState: {errors},
    } = useForm();

    const navigate = useNavigate();
    const {user, login} = useAuth();
    const [params] = useSearchParams();
    const returnUrl = params.get('returnUrl');

    useEffect(() => {
        if (!user) return;
        returnUrl ? navigate(returnUrl) : navigate('/');
    }, [user]);

    const submit = async ({email, pass}) => {
        await login(email, pass);
    };
    return (
        <div>
            <div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit(submit)} noValidate>
                    <Input
                        defaultValue={undefined}
                        type='email'
                        label='Email'
                        {...register('email', {
                            required: true,
                            pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i,
                                message: 'Email Is Not Valid',
                            },
                        })}
                        error={errors.email}
                    />

                    <Input
                        defaultValue={undefined}
                        type='password'
                        label='Password'
                        {...register('pass', {
                            required: true,
                        })}
                        error={errors.pass}
                    />

                    <button type='submit'>Login</button>
                    <div className='register'>
                        New user? &nbsp;
                        <Link
                            to={`/register${returnUrl ? '?returnUrl=' + returnUrl : ''}`}
                        >
                            Register here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
