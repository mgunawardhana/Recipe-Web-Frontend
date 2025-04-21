import React, { useState } from 'react';

interface AuthFormProps {
    showRegister: boolean;
    setShowRegister: (value: boolean) => void;
    onLogin: (email: string, password: string) => void;
    onRegister: (email: string, password: string, confirmPassword: string) => boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ showRegister, setShowRegister, onLogin, onRegister }) => {
    const [email, setEmail] = useState<string>('abc@gmail.com');
    const [password, setPassword] = useState<string>('12345');
    const [confirmPassword, setConfirmPassword] = useState<string>('12345');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('0719043372');
    const [error, setError] = useState<string>('The password does not match');

    const handleSubmit = () => {
        setError('');
        if (showRegister) {
            const success = onRegister(email, password, confirmPassword);
            if (!success) {
                setError('The password does not match');
            }
        } else {
            if (!email || !password) {
                setError('Please enter email and password');
                return;
            }
            onLogin(email, password);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full mx-auto">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <h1 className="text-3xl font-bold text-center">
                        <span className="text-pink-500">co</span>
                        <span className="text-pink-500">o</span>
                        <span className="text-orange-500">k</span>
                    </h1>
                </div>

                <h2 className="text-2xl font-semibold mb-6">{showRegister ? 'Register' : 'Login'}</h2>

                {showRegister ? (
                    <>
                        <div className="w-full max-w-2xl">
                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <div className="w-full md:w-1/2">
                                    <label className="block text-sm text-gray-600 mb-1 font-medium">
                                        — Your name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-700"
                                    />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <label className="block text-sm text-gray-600 mb-1 font-medium md:invisible">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-700"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <div className="w-full md:w-1/2">
                                    <label className="block text-sm text-gray-600 mb-1 font-medium">
                                        — Email *
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="abc@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-700"
                                    />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <label className="block text-sm text-gray-600 mb-1 font-medium">
                                        — Phone number *
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="011 2222 333"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-700"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <div className="w-full md:w-1/2">
                                    <label className="block text-sm text-gray-600 mb-1 font-medium">
                                        — Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-700"
                                    />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <label className="block text-sm text-gray-600 mb-1 font-medium">
                                        — Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`border p-3 rounded-md w-full focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-700 ${
                                            error ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {error && (
                                        <p className="text-red-500 text-xs mt-1">{error}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 mb-6">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-pink-500 text-white py-2 px-6 rounded hover:bg-pink-600 transition"
                                >
                                    Create Account
                                </button>
                            </div>
                            <div className="text-center">
                                <span className="text-gray-600">Already have an account?</span>{' '}
                                <span
                                    className="text-pink-500 cursor-pointer hover:underline"
                                    onClick={() => setShowRegister(false)}
                                >
                                    Login
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-full max-w-2xl">
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-1 font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-700"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-1 font-medium">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-700"
                                />
                            </div>
                            {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
                            <div className="mt-6 mb-6">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-pink-500 text-white py-2 px-6 rounded hover:bg-pink-600 transition"
                                >
                                    Sign In
                                </button>
                            </div>
                            <div className="text-center">
                                <span className="text-gray-600">Don't have an account?</span>{' '}
                                <span
                                    className="text-pink-500 cursor-pointer hover:underline"
                                    onClick={() => setShowRegister(true)}
                                >
                                    Create account
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthForm;