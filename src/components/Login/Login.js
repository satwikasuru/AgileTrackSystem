import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const { login } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:4000/users?email=${email}&password=${password}`);
            if (response.data.length > 0) {
                const user = response.data[0];
                login(user);
                if (user.role === 'admin') {
                    history.push('/');
                } else {
                    history.push('/profiles');
                }
            } else {
                alert('Invalid email or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>LOGIN</h2>
                <form onSubmit={handleLogin}>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <div className="button-container">
                        <button type="submit">Login</button>
                        <button className="signup-btn" onClick={() => history.push('/signup')}>Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
