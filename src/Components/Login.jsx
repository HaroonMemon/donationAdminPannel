import React, { useState } from 'react';
import './style.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './FirebaseConfig';
import {useNavigate} from 'react-router-dom';
import AuthDetails from './AuthDetails';

const Login = () => {
    // alert("email: admin@admin.com n/password: admin123");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();
    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                alert("user login");
                navigate('/home')
            })
            .catch((error) => {
                console.log(error);
                alert("email: admin@admin.com n/password: admin123");
            });
    };

    return (
        <div className="login">
            <div className="loginForm">
                <h1>Admin Panel Login</h1>
                <form className="form" onSubmit={signIn}>
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="admin@admin.com"
                        value={email}
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="admin123"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        required
                    />

                    <button type="submit">Submit</button>
                </form>
            </div>
      {/* <AuthDetails /> */}

        </div>
    );
};

export default Login;
