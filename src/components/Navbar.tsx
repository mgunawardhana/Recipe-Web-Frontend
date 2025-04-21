import { Link } from 'react-router-dom';
import React from "react";

interface NavbarProps {
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow">
            <h1 className="text-2xl font-bold">
                <span className="text-pink-500">COO</span>
                <span className="text-orange-500">K</span>
            </h1>
            <div className="space-x-4">
                <Link to="/" className="text-gray-700 hover:text-pink-500">
                    Home
                </Link>
                <Link to="/favorites" className="text-gray-700 hover:text-pink-500">
                    Favorite
                </Link>
                <button onClick={onLogout} className="text-gray-700 hover:text-pink-500">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;