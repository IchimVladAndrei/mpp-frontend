import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import Input from '../../components/Input/Input';
import {useAuth} from '../../hooks/useAuth';

export default function RegisterPage() {
    const auth = useAuth();
    const {user} = auth;
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const returnUrl = params.get('returnUrl');

    useEffect(() => {
        if (!user) return;
        returnUrl ? navigate(returnUrl) : navigate('/');
    }, [user]);

    const {
        handleSubmit,
        register,
        getValues,
        formState: {errors},
    } = useForm();

    const submit = async (newUserData) => {
        await auth?.register(newUserData);
    };

    return (
        <div>
            <div>
                <h1>Register</h1>
                <form onSubmit={handleSubmit(submit)} noValidate>
                    <Input
                        defaultValue={undefined}
                        type='text'
                        label='Name'
                        {...register('name', {
                            required: true,
                            minLength: 5,
                        })}
                        error={errors.name}
                    />

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
                            minLength: 5,
                        })}
                        error={errors.password}
                    />

                    <Input
                        defaultValue={undefined}
                        type='password'
                        label='Confirm password'
                        {...register('confirmPass', {
                            required: true,
                            validate: (value) =>
                                value !== getValues('pass')
                                    ? 'Passwords Do No Match'
                                    : true,
                        })}
                        error={errors.confirmPassword}
                    />

                    <button type='submit'>Register</button>
                    <div>
                        Already a user? &nbsp;
                        <Link
                            to={`/login${returnUrl ? '?returnUrl=' + returnUrl : ''}`}
                        >
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
