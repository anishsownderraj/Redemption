// dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// api
import api from './api';

const UserForm = () => {
    const navigate = useNavigate();
    const [defaultFormType, setDefaultFormType] = useState('register');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleFormChange = () => {
        if (defaultFormType === 'register') {
            setDefaultFormType('login');
        } else {
            setDefaultFormType('register');
        }
    };
    const handleRegister = async (e) => {
        setError(null);
        try {
            const response = await api.post('/user/signup', { email, password });
            const data = response.data;
            if (data.error) {
                setError(data.error);
                return;
            }
            localStorage.setItem("token", data.access_token);
            navigate('/to-do');
        } catch (e) {
            setError('Error signing up');
        }
    };
    const handleLogin = async (e) => {
        setError(null);
        try {
            const response = await api.post('/user/login', { email, password });
            const data = response.data;
            if (data.error) {
                setError(data.error);
                return;
            }
            localStorage.setItem("token", data.access_token);
            navigate('/to-do');
        } catch (e) {
            setError('Error loggin in');
        }
    };
    const isRegister = defaultFormType === 'register';
    return (
        <div className='user-form'>
            {isRegister ? (
                <h1>Register</h1>
            ) : (
                <h1>Login</h1>
            )}
            {error && (
                <div className='error-message'>{error}</div>
            )}
            <div className='input-field'>
                <span>Email</span>
                <input
                    className='username'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
            </div>
            <div className='input-field'>
                <span>Password</span>
                <input
                    className='password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
            </div>
            <div className='form-actions'>
                <button
                    onClick={isRegister ? handleRegister : handleLogin}
                >
                    {isRegister ? 'Register' : 'Login'}
                </button>
                <button
                    onClick={handleFormChange}
                >
                    {`Click here to ${!isRegister ? 'Register' : 'Login'}`}
                </button>
            </div>
        </div>
    );
};

export default UserForm;