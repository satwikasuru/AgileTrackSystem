import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/users', {
                name,
                email,
                password,
                role: 'employee'
            });
            history.push('/login');
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp}>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <div className="button-container">
                        <button type="submit">Sign Up</button>
                        <button className="login-btn" onClick={() => history.push('/login')}>Go to Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
