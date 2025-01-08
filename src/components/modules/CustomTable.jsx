import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const CustomTable = () => {
    const [usrData, setUserData] = useState();
    const [rowPerPage, setRowPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `https://api.razzakfashion.com/?paginate=${rowPerPage}&search=${search}&page=${currentPage}`
                );
                setUserData(res?.data);
                setTotalPage(res?.data?.total);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, [rowPerPage, currentPage, search]);

    return (
        <div>
            <div className="overflow-x-auto my-20">
                {/* Search Input */}
                <div>
                    <input
                        className="mb-5 text-white border rounded px-3 py-2 focus:outline-none"
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Table */}
                <table className="mb-5 table-auto w-full border-collapse border border-gray-800 text-white">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="border border-gray-700 px-4 py-2 text-left">
                                <input type="checkbox" />
                            </th>
                            <th className="border border-gray-700 px-4 py-2 text-left">Name</th>
                            <th className="border border-gray-700 px-4 py-2 text-left">Email</th>
                            <th className="border border-gray-700 px-4 py-2 text-left">Email Verified At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usrData?.data.map((user) => (
                            <tr key={user.id} className="bg-gray-800 hover:bg-gray-700">
                                <td className="border border-gray-700 px-4 py-2">
                                    <input type="checkbox" />
                                </td>
                                <td className="border border-gray-700 px-4 py-2">{user?.name}</td>
                                <td className="border border-gray-700 px-4 py-2">{user?.email}</td>
                                <td className="border border-gray-700 px-4 py-2">
                                    {user?.email_verified_at
                                        ? new Date(user.email_verified_at).toLocaleString('en-US', {
                                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit', hour12: true
                                        })
                                        : "N/A"}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-end">
                    <div className="flex gap-5 items-center">
                        {/* Rows Per Page Input */}
                        <p>
                            Row per page:{" "}
                            <input
                                value={rowPerPage}
                                onChange={(e) => setRowPerPage(Number(e.target.value))}
                                className="border rounded px-2 py-1 text-white w-16 focus:outline-none"
                                type="number"
                                min="5"
                                max="50"
                            />
                        </p>

                        {/* Pagination Info */}
                        <p>
                            {currentPage * rowPerPage - rowPerPage + 1} -{" "}
                            {Math.min(currentPage * rowPerPage, totalPage)} of {totalPage}
                        </p>

                        {/* Previous Page Button */}
                        <IoIosArrowBack
                            className={`text-xl ${currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "cursor-pointer"
                                }`}
                            onClick={() => {
                                if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                            }}
                        />

                        {/* Next Page Button */}
                        <IoIosArrowForward
                            className={`text-xl ${usrData?.last_page && currentPage === usrData?.last_page
                                    ? "text-gray-500 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                            onClick={() => {
                                if (usrData?.last_page && currentPage < usrData?.last_page) {
                                    setCurrentPage((prev) => prev + 1);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomTable;
