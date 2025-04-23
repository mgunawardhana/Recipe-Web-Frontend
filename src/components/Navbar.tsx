import {Link} from 'react-router-dom';
import React from "react";
import {Heart, Home, LogOut} from 'lucide-react';

interface NavbarProps {
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({onLogout}) => {

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
    };

    return (<nav className="flex items-center justify-between p-4 bg-white shadow relative">
            <div className="z-10">
                <h1 className="text-3xl font-bold">
                    <span className="text-yellow-500">C</span>
                    <span className="text-amber-500">O</span>
                    <span className="text-rose-400">O</span>
                    <span className="text-pink-500">K</span>
                </h1>
            </div>


            <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-8">
                <Link to="/" className="text-gray-700 hover:text-pink-500 flex items-center">
                    <span className="uppercase text-sm font-medium">Home</span>
                </Link>
                <Link to="/favorites" className="text-gray-700 hover:text-pink-500 flex items-center">
                    <span className="uppercase text-sm font-medium">Favourite</span>
                </Link>
            </div>

            <div className="flex items-center space-x-6 z-10">
                <div className="flex md:hidden space-x-4">
                    <Link to="/" className="text-gray-700 hover:text-pink-500">
                        <Home size={24}/>
                    </Link>
                    <Link to="/favorites" className="text-gray-700 hover:text-pink-500">
                        <Heart size={24}/>
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-pink-500 flex items-center"
                    aria-label="Logout"
                >
                    <LogOut size={24}/>
                    <span className="hidden md:block uppercase text-sm font-medium">
                        Logout
                    </span>
                </button>
            </div>
        </nav>);
};

export default Navbar;