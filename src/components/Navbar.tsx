import { Link } from 'react-router-dom';
import React from "react";
import { LogOut } from 'lucide-react';

interface NavbarProps {
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    return (
        <nav className="flex justify-between items-center p-4 bg-white shadow">
            <div className="flex-1">
                <h1 className="text-3xl font-bold">
                    <span className="text-yellow-500">C</span>
                    <span className="text-amber-500">O</span>
                    <span className="text-rose-400">O</span>
                    <span className="text-pink-500">K</span>
                </h1>
            </div>
            <div className="flex-1 flex justify-center space-x-8">
                <Link to="/" className="text-gray-700 hover:text-pink-500 uppercase text-sm font-medium">
                    Home
                </Link>
                <Link to="/favorites" className="text-gray-700 hover:text-pink-500 uppercase text-sm font-medium">
                    Favourite
                </Link>
            </div>

            <div className="flex-1 flex justify-end">
                <button
                    onClick={onLogout}
                    className="text-gray-700 hover:text-pink-500"
                    aria-label="Logout"
                >
                    <LogOut size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;