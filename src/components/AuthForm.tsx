import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import {z} from 'zod';
import {inputBaseClasses} from '@mui/material';
import api from "../services/services.ts";
import {LOGIN_ENDPOINT, REGISTER_ENDPOINT} from "../services/routes/recipeRouting.ts";

const loginSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = loginSchema.extend({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
    phoneNumber: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number'),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
    age: z.number().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match", path: ['confirmPassword'],
});

const handleLogin = async (email: string, password: string) => {
    try {

        const response = await api.post(LOGIN_ENDPOINT, { email, password });

        console.log("Login attempt:", { email });
        console.log("Login response:", response.data);
        console.log(response.data.token);

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

const handleRegister = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}) => {
    try {
        const apiPayload = {
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            password: userData.password,
            phone: userData.phoneNumber,
            address: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            age: 0
        };

        console.log("Registration payload:", apiPayload);
        const response = await api.post(REGISTER_ENDPOINT, apiPayload);

        console.log("Registration attempt:", {
            email: userData.email,
            name: apiPayload.name,
            phone: userData.phoneNumber
        });
        console.log("Registration response:", response.data);

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};



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

    const [, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [field]: event.target.value});
        if (errors[field]) {
            setErrors({...errors, [field]: ''});
        }
    };

    const handleSubmit = async () => {
        try {

            setIsLoading(true);

            if (showRegister) {

                const result = registerSchema.parse(formData);

                await handleRegister({
                    email: result.email,
                    password: result.password,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    phoneNumber: result.phoneNumber
                });

                onRegister(result.email, result.password, result.confirmPassword);

            } else {

                const result = loginSchema.parse(formData);

                console.log("result ",result);

                await handleLogin(result.email, result.password);

                onLogin(result.email, result.password);
            }

            setIsLoading(false);

        } catch (error) {

            setIsLoading(false);

            if (error instanceof z.ZodError) {

                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });

                setErrors(fieldErrors);

            } else {

                setErrors({
                    [showRegister ? 'confirmPassword' : 'password']:
                        'Authentication failed. Please check your credentials.'
                });

                console.error(showRegister ? "Registration error:" : "Login error:", error);
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
        sx: {
            '& .MuiInputBase-input': {
                fontSize: {xs: '0.875rem', sm: '1rem', lg: '1.125rem'},
            }, '& .MuiInputLabel-root': {
                fontSize: {xs: '0.875rem', sm: '1rem', lg: '1.125rem'},
            },
        },
    });

    return (<div className="flex items-center justify-center min-h-screen w-full mx-auto px-2 sm:px-4">
        <div
            className={`w-full ${showRegister ? 'max-w-5/12 scale-110' : 'max-w-3/12'} mx-auto overflow-auto`}
        >
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl w-full mx-auto">
                <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
                        <span className="text-pink-500">CO</span>
                        <span className="text-pink-500">O</span>
                        <span className="text-orange-500">K</span>
                    </h1>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6">{showRegister ? 'Register' : 'Login'}</h2>

                {showRegister ? (<div className="w-full max-w-2xl">
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="w-full sm:w-1/2">
                            <TextField {...textFieldProps('firstName', 'First name')} />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <TextField {...textFieldProps('lastName', 'Last name')} />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="w-full sm:w-1/2">
                            <TextField {...textFieldProps('email', 'Email', 'email')} />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <TextField {...textFieldProps('phoneNumber', 'Phone number', 'tel')} />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="w-full sm:w-1/2">
                            <TextField {...textFieldProps('password', 'Password', 'password')} />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <TextField {...textFieldProps('confirmPassword', 'Confirm Password', 'password')} />
                        </div>
                    </div>
                    <div className="mt-6 mb-6">
                        <button
                            onClick={handleSubmit}
                            className="bg-pink-500 text-white py-2 px-4 sm:px-6 rounded hover:bg-pink-600 transition w-full sm:w-auto"
                        >
                            Create Account
                        </button>
                    </div>
                    <div className="text-center text-sm sm:text-base">
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
                            className="bg-pink-500 text-white py-2 px-4 sm:px-6 rounded hover:bg-pink-600 transition w-full sm:w-auto"
                        >
                            Sign In
                        </button>
                    </div>
                    <div className="text-center text-sm sm:text-base">
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