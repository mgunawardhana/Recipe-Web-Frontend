import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import {z} from 'zod';
import {inputBaseClasses} from '@mui/material';

const loginSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = loginSchema.extend({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phoneNumber: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match", path: ['confirmPassword'],
});

interface AuthFormProps {
    showRegister: boolean;
    setShowRegister: (value: boolean) => void;
    onLogin: (email: string, password: string) => void;
    onRegister: (email: string, password: string, confirmPassword: string) => boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({showRegister, setShowRegister, onLogin, onRegister}) => {
    const [formData, setFormData] = useState({
        email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phoneNumber: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [field]: event.target.value});
        if (errors[field]) {
            setErrors({...errors, [field]: ''});
        }
    };

    const handleSubmit = () => {
        try {
            if (showRegister) {
                const result = registerSchema.parse(formData);
                const success = onRegister(result.email, result.password, result.confirmPassword);
                if (!success) {
                    setErrors({confirmPassword: 'Registration failed'});
                }
            } else {
                const result = loginSchema.parse(formData);
                onLogin(result.email, result.password);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(fieldErrors);
            }
        }
    };

    const textFieldProps = (field: keyof typeof formData, label: string, type = 'text') => ({
        id: `outlined-${field}`,
        label,
        variant: 'outlined' as const,
        type,
        value: formData[field],
        onChange: handleChange(field),
        error: !!errors[field],
        helperText: errors[field],
        fullWidth: true,
        slotProps: {
            input: {
                endAdornment: type !== 'password' ? (<InputAdornment
                    position="end"
                    sx={{
                        opacity: 0, pointerEvents: 'none', [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
                            opacity: 1,
                        },
                    }}
                >
                    {field === 'phoneNumber' ? '📞' : field === 'email' ? '@' : ''}
                </InputAdornment>) : undefined,
            },
        },
    });

    return (<div className="flex items-center justify-center min-h-screen w-full mx-auto">
        <div
            className={`w-full ${showRegister ? 'max-w-5/12 scale-110' : 'max-w-3/12'} mx-auto`}
        >
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full mx-auto">
                <div className="flex justify-center mb-8">
                    <h1 className="text-3xl font-bold text-center">
                        <span className="text-pink-500">CO</span>
                        <span className="text-pink-500">O</span>
                        <span className="text-orange-500">K</span>
                    </h1>
                </div>

                <h2 className="text-2xl font-semibold mb-6">{showRegister ? 'Register' : 'Login'}</h2>

                {showRegister ? (<div className="w-full max-w-2xl">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="w-full md:w-1/2">
                            <TextField {...textFieldProps('firstName', 'First name')} />
                        </div>
                        <div className="w-full md:w-1/2">
                            <TextField {...textFieldProps('lastName', 'Last name')} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="w-full md:w-1/2">
                            <TextField {...textFieldProps('email', 'Email', 'email')} />
                        </div>
                        <div className="w-full md:w-1/2">
                            <TextField {...textFieldProps('phoneNumber', 'Phone number', 'tel')} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="w-full md:w-1/2">
                            <TextField {...textFieldProps('password', 'Password', 'password')} />
                        </div>
                        <div className="w-full md:w-1/2">
                            <TextField {...textFieldProps('confirmPassword', 'Confirm Password', 'password')} />
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
                </div>) : (<div className="w-full max-w-2xl">
                    <div className="mb-4">
                        <TextField {...textFieldProps('email', 'Email', 'email')} />
                    </div>
                    <div className="mb-4">
                        <TextField {...textFieldProps('password', 'Password', 'password')} />
                    </div>
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
                </div>)}
            </div>
        </div>
    </div>);
};

export default AuthForm;