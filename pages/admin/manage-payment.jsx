import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./layout";
import AdminRoutes from "../adminRoutes";
import Filter from "../../public/Filter.svg";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const ManagePayment = () => {
  const [surveyData, setSurveyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStyle, setViewStyle] = useState("Table View");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/profile-survey/?isActive=true&page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data } = response.data;
      setSurveyData(data);
    } catch (error) {
      console.error("Error fetching survey data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, [currentPage, itemsPerPage]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleSort = (order) => {
    const sortedData = [...surveyData].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === "Ascending" ? dateA - dateB : dateB - dateA;
    });
    setSurveyData(sortedData);
    setSortOrder(order);
  };

  const filteredData = surveyData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionClick = (id) => {
    console.log(`Action clicked for survey ID: ${id}`);
    // Add your action logic here
  };

  return (
      <div className="p-4 max-w-full">
        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          {/* Search Bar */}
          <div className="flex-grow relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, email, and phone number"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full bg-white focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* View and Sort Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            {/* View Selector */}
            <select
              className="px-4 py-2 text-sm border border-gray-300 rounded-full bg-gray-100 text-gray-600 focus:outline-none"
              value={viewStyle}
              onChange={(e) => setViewStyle(e.target.value)}
            >
              <option>Table View</option>
              <option>Grid View</option>
              <option>List View</option>
            </select>

            {/* Items per Page Selector */}
            <select
              className="px-4 py-2 text-sm border border-gray-300 rounded-full bg-gray-100 text-gray-600 focus:outline-none"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            >
              <option value={10}>View 10</option>
              <option value={50}>View 50</option>
              <option value={100}>View 100</option>
            </select>

            {/* Sort Button */}
            <button
              onClick={() => setIsSortModalOpen(true)}
              className="relative px-4 py-2 gap-2 text-sm font-medium border border-gray-300 rounded-full bg-gray-100 flex items-center justify-center focus:outline-none"
            >
              <Filter/>
              Sort
            </button>
          </div>
        </div>

        {/* Sort Modal */}
        {isSortModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-96 bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Sort</h3>
                <button
                  onClick={() => setIsSortModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  Sort By (Created Date)
                </p>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="form-radio rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={sortOrder === "Ascending"}
                      onChange={() => handleSort("Ascending")}
                    />
                    <span className="text-sm text-gray-700">Ascending</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="form-radio rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={sortOrder === "Descending"}
                      onChange={() => handleSort("Descending")}
                    />
                    <span className="text-sm text-gray-700">Descending</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setSortOrder("")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsSortModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Survey Data */}
        <div className="overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500 text-lg">Loading...</p>
            </div>
          ) : filteredData.length > 0 ? (
            viewStyle === "Table View" ? (
              <div className="w-[90vw] md:w-full overflow-scroll md:overflow-hidden">
                <table className=" w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-600 font-medium">
                      <th className="py-3 px-4">S. NO</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Hub Coins</th>
                      <th className="py-3 px-4">Created At</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-800">
                    {filteredData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-100">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">{item.title}</td>
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4">{item.hubCoins}</td>
                        <td className="py-3 px-4">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleActionClick(item.id)}
                            className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center"
                          >
                            i
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : viewStyle === "Grid View" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 shadow-md hover:shadow-lg transition"
                  >
                    <h2 className="font-bold text-lg mb-2">{item.title}</h2>
                    <p className="text-gray-600">
                      <b>Description:</b> {item.description}
                    </p>
                    <p className="text-gray-600">
                      <b>Hub Coins:</b> {item.hubCoins}
                    </p>
                    <p className="text-gray-600">
                      <b>Created:</b>{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 shadow-md hover:shadow-lg transition"
                  >
                    <h2 className="font-bold text-lg mb-2">{item.title}</h2>
                    <p className="text-gray-600">
                      <b>Description:</b> {item.description}
                    </p>
                    <p className="text-gray-600">
                      <b>Hub Coins:</b> {item.hubCoins}
                    </p>
                    <p className="text-gray-600">
                      <b>Created:</b>{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-500 text-lg">No surveys found</p>
            </div>
          )}
        </div>
      </div>
  );
};

export default AdminRoutes(ManagePayment);
