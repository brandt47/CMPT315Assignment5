
import React, { useRef, useState } from 'react';
import { User } from '../../../models/User';

interface LoginFormProps {
    updateLoggedInUser(user: User): void;
    switchToSignUp: () => void; // New prop for switching forms
}

export const LoginForm: React.FC<LoginFormProps> = ({ updateLoggedInUser, switchToSignUp }) => {
    const [error, setError] = useState<boolean>(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleLoginUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (emailRef.current && passwordRef.current) {
            try {
                const response = await fetch('http://localhost:8000/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: emailRef.current.value,
                        password: passwordRef.current.value,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Login failed');
                }

                const data = await response.json();
                setError(false);
                updateLoggedInUser(data.user);
            } catch (error) {
                setError(true);
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            {error && <p className="text-sm text-red-500 font-medium">Username or password incorrect</p>}
            <input id="email" type="email" placeholder="Email" required ref={emailRef} className="border p-2 rounded w-full mb-2" />
            <input id="password" type="password" placeholder="Password" required ref={passwordRef} className="border p-2 rounded w-full mb-2" />
            <button type="submit" onClick={handleLoginUser} className="bg-orange-500 text-white px-4 py-2 rounded mt-3 hover:bg-orange-600 w-full">
                Login
            </button>
            <p className="mt-4 text-sm">
                Don’t have an account? <button onClick={switchToSignUp} className="text-orange-500">Create one!</button>
            </p>
        </div>
    );
};