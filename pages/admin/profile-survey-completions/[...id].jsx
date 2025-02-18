import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTitle,
  hideAdd,
  hideExcel,
  hideRefresh,
  resetExcel,
  setTitle,
  showExcel,
} from "@/store/adminbtnSlice";
import { useRouter } from "next/router";
import AdminRoutes from "@/pages/adminRoutes";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Profile_Survey_Completions = () => {
  // State for user data from API
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStyle, setViewStyle] = useState("Table View");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("Descending");
  const [tempSortOrder, setTempSortOrder] = useState("Descending");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const excelClicked = useSelector((state) => state.adminbtn.excelClicked);

  // Extract survey id from URL parameters
  const { id } = router.query;

  useEffect(() => {
    dispatch(setTitle("Profile Survey Completions"));
    dispatch(
      showExcel({ label: "Generate Excel", actionType: "GENERATE_EXCEL" })
    );

    return () => {
      dispatch(hideAdd());
      dispatch(hideRefresh());
      dispatch(hideExcel());
      dispatch(clearTitle());
    };
  }, [dispatch, router.asPath]);

  // Generate Excel file from userData
  const handleGenerateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UsersTakenSurvey");
    XLSX.writeFile(workbook, "UsersTakenSurvey.xlsx");
  };

  useEffect(() => {
    if (excelClicked) {
      handleGenerateExcel();
      dispatch(resetExcel());
    }
  }, [excelClicked, dispatch]);

  // Fetch user survey data based on id param
  const fetchUsers = async () => {
    if (!id) return; // Wait until id is available
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/profile-survey/usersTakenSurvey/${id}`,
        {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { listOfUsers } = response.data;
      const sortedData = [...listOfUsers].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setUserData(sortedData);
    } catch (error) {
      console.error("Error fetching users data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [id]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Sorting methods
  const handleApplySort = () => {
    setSortOrder(tempSortOrder);
    const sortedData = [...userData].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return tempSortOrder === "Ascending" ? dateA - dateB : dateB - dateA;
    });
    setUserData(sortedData);
    setIsSortModalOpen(false);
  };

  const handleClearSort = () => {
    setTempSortOrder("Descending");
    setSortOrder("Descending");
    const sortedData = [...userData].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setUserData(sortedData);
  };

  // Filter users by name or email
  const filteredData = userData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Client-side pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Action handler (visible in all views)
  const handleActionClick = (userId) => {
    console.log(`Action clicked for user ID: ${userId}`);
    router.push(`/admin/userinformation/${userId}`);
  };

  return (
    <div className="p-4 max-w-full">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        {/* Search */}
        <div className="flex-grow relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name or email"
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
          <select
            className="px-4 py-2 text-sm border border-gray-300 rounded-full bg-gray-100 text-gray-600 focus:outline-none"
            value={viewStyle}
            onChange={(e) => setViewStyle(e.target.value)}
          >
            <option>Table View</option>
            <option>Grid View</option>
            <option>List View</option>
          </select>

          <select
            className="px-4 py-2 text-sm border border-gray-300 rounded-full bg-gray-100 text-gray-600 focus:outline-none"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>View 10</option>
            <option value={50}>View 50</option>
            <option value={100}>View 100</option>
          </select>

          <button
            onClick={() => setIsSortModalOpen(true)}
            className="relative px-4 py-2 text-sm font-medium border border-gray-300 rounded-full bg-gray-100 flex items-center justify-center focus:outline-none"
          >
            <img src="/Filter.svg" alt="Sort" className="w-5 h-5 mr-2" />
            Sort
            {sortOrder !== "Descending" && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
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
              <p className="text-sm text-gray-600 mb-3">Sort By (Created Date)</p>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="form-radio rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={tempSortOrder === "Ascending"}
                    onChange={() => setTempSortOrder("Ascending")}
                  />
                  <span className="text-sm text-gray-700">Ascending</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="form-radio rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={tempSortOrder === "Descending"}
                    onChange={() => setTempSortOrder("Descending")}
                  />
                  <span className="text-sm text-gray-700">Descending</span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleClearSort}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100"
              >
                Clear
              </button>
              <button
                onClick={handleApplySort}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Display */}
      <div className="overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        ) : filteredData.length > 0 ? (
          viewStyle === "Table View" ? (
            <div className="w-[90vw] md:w-full overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-600 font-medium">
                    <th className="py-3 px-4">S. NO</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Hub Coins</th>
                    <th className="py-3 px-4">Created At</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                  {currentItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4">{item.email}</td>
                      <td className="py-3 px-4">{item.phone}</td>
                      <td className="py-3 px-4">{item.hubCoins}</td>
                      <td className="py-3 px-4">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleActionClick(item.id)}
                          className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
                        >
                          i
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : viewStyle === "Grid View" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="relative border rounded-lg p-4 shadow-md hover:shadow-lg"
                >
                  {/* Action Icon at top-right */}
                  <button
                    onClick={() => handleActionClick(item.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs"
                  >
                    i
                  </button>
                  <div className="mt-2">
                    <h2 className="font-bold text-lg mb-2">{item.name}</h2>
                    <p className="text-gray-600 mb-1">
                      <b>Email:</b> {item.email}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <b>Phone:</b> {item.phone}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <b>Hub Coins:</b> {item.hubCoins}
                    </p>
                    <p className="text-gray-600">
                      <b>Created:</b>{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="flex flex-col gap-4">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="relative border rounded-lg p-4 shadow-md hover:shadow-lg flex flex-col sm:flex-row justify-between items-start"
                >
                  {/* Action Icon at top-right */}
                  <button
                    onClick={() => handleActionClick(item.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs"
                  >
                    i
                  </button>
                  <div>
                    <h2 className="font-bold text-lg mb-1">{item.name}</h2>
                    <p className="text-gray-600 mb-1">
                      <b>Email:</b> {item.email}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <b>Phone:</b> {item.phone}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <b>Hub Coins:</b> {item.hubCoins}
                    </p>
                    <p className="text-gray-600">
                      <b>Created:</b>{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRoutes(Profile_Survey_Completions);
