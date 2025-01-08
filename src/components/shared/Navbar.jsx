import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="flex justify-between py-5 px-10 fixed top-0 left-0 w-full z-50 shadow-md">
            <div className="font-bold">
                <span className="text-blue-900">PRINT</span> MANZIL
            </div>
            <div>
                <ul className="flex gap-10">
                    <li>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/uploadLogo" 
                            className={({ isActive }) => (isActive ? "text-blue-500" : "")}
                        >
                            Upload Logo
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
