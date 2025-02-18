import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./layout";
import AdminRoutes from "../adminRoutes";
import * as XLSX from "xlsx";
import Filter from "../../public/Filter.svg";
import { useRouter } from "next/router";
import {
  clearTitle,
  hideAdd,
  hideExcel,
  hideRefresh,
  resetExcel,
  setTitle,
  showExcel,
  showRefresh,
} from "@/store/adminbtnSlice";
import { useDispatch, useSelector } from "react-redux";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const UserManagement = () => {
  // Default sortOrder is "Descending" so that the latest user appears on top.
  const [sortOrder, setSortOrder] = useState("Descending");
  // tempSortOrder is used inside the modal before the user clicks Apply.
  const [tempSortOrder, setTempSortOrder] = useState("Descending");

  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStyle, setViewStyle] = useState("Table View");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ─── Define the data fields to show/hide via pills ──────────────────────
  const dataFields = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Mobile Number" },
    { key: "dob", label: "Date of Birth" },
    { key: "createdAt", label: "Created At" },
    { key: "role", label: "Role" },
  ];

  const dispatch = useDispatch();

  // Get the Excel trigger flag from Redux.
  const excelClicked = useSelector((state) => state.adminbtn.excelClicked);

  // Set header configuration on mount.
  useEffect(() => {
    dispatch(setTitle("User Management"));
    dispatch(showRefresh({ label: "Refresh", redirectTo: router.asPath }));
    
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

  // Helper function to format dates as "day month year" (e.g. 14 Feb 2025)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Generate Excel file from userData.
  const handleGenerateExcel = () => {
    // Optionally format dates before exporting
    const formattedData = userData.map((user) => ({
      ...user,
      createdAt: formatDate(user.createdAt),
      dob: user.dob && user.dob !== "-" ? formatDate(user.dob) : user.dob,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserManagement");
    XLSX.writeFile(workbook, "UserManagement.xlsx");
  };

  useEffect(() => {
    if (excelClicked) {
      handleGenerateExcel();
      dispatch(resetExcel());
    }
  }, [excelClicked, dispatch]);

  // All fields are visible by default
  const [visibleFields, setVisibleFields] = useState(
    dataFields.map((field) => field.key)
  );

  // Toggle a field’s visibility
  const toggleVisibleField = (fieldKey) => {
    setVisibleFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((key) => key !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  // Fetch users from API and sort them according to the current sortOrder.
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/all?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data, total } = response.data;
      const transformedData = data.map((user) => ({
        ...user,
        dob: user.dob || "-", // Replace missing DOB with a placeholder
      }));
      // Sort the fetched data based on the current sortOrder.
      const sortedData = [...transformedData].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "Ascending" ? dateA - dateB : dateB - dateA;
      });
      setUserData(sortedData);
      setTotalUsers(total);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch users when pagination changes.
  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  // When the user clicks Apply in the sort modal,
  // update sortOrder and re-sort the currently displayed data.
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

  // Filter the data using the search term.
  const filteredData = userData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone && item.phone.includes(searchTerm))
  );

  const handleActionClick = (id) => {
    console.log(`Action button clicked for user with ID: ${id}`);
    router.push(`/admin/userinformation/${id}`);
  };

  return (
    <div className="p-4">
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

          {/* Sort Button with a red dot if a non-default filter is applied */}
          <button
            onClick={() => setIsSortModalOpen(true)}
            className="relative px-4 py-2 gap-2 text-sm font-medium border border-gray-300 rounded-full bg-gray-100 flex items-center justify-center focus:outline-none"
          >
            <Filter />
            Sort
            {sortOrder !== "Descending" && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Pills for Data Fields */}
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
        {dataFields.map((field) => (
          <button
            key={field.key}
            onClick={() => toggleVisibleField(field.key)}
            className={`px-3 py-1 text-sm rounded-full border whitespace-nowrap ${
              visibleFields.includes(field.key)
                ? "bg-[#0057A1] text-white border-blue-500"
                : "bg-gray-200 text-gray-800 border-gray-200"
            }`}
          >
            {field.label}
          </button>
        ))}
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
                onClick={() => setTempSortOrder("Descending")}
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

      {/* Users Data Display */}
      <div className="">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        ) : filteredData.length > 0 ? (
          viewStyle === "Table View" ? (
            <div className="w-full overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-600 font-medium">
                    <th className="py-3 px-4">S. NO</th>
                    {dataFields
                      .filter((field) => visibleFields.includes(field.key))
                      .map((field) => (
                        <th key={field.key} className="py-3 px-4">
                          {field.label}
                        </th>
                      ))}
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4">{index + 1}</td>
                      {dataFields
                        .filter((field) => visibleFields.includes(field.key))
                        .map((field) => (
                          <td key={field.key} className="py-3 px-4 break-words">
                            {field.key === "createdAt"
                              ? formatDate(item.createdAt)
                              : field.key === "dob" && item.dob !== "-"
                              ? formatDate(item.dob)
                              : item[field.key] || "-"}
                          </td>
                        ))}
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
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 shadow-md hover:shadow-lg transition w-full flex flex-col justify-between"
                  >
                    <div>
                      {visibleFields.includes("name") && (
                        <h2 className="font-bold text-lg mb-2 break-words">
                          {item.name}
                        </h2>
                      )}
                      {visibleFields.includes("email") && (
                        <p className="text-gray-600 break-words">
                          <b>Email:</b> {item.email}
                        </p>
                      )}
                      {visibleFields.includes("phone") && (
                        <p className="text-gray-600 break-words">
                          <b>Mobile Number:</b> {item.phone || "N/A"}
                        </p>
                      )}
                      {visibleFields.includes("dob") && (
                        <p className="text-gray-600 break-words">
                          <b>Date of Birth:</b>{" "}
                          {item.dob !== "-" ? formatDate(item.dob) : item.dob}
                        </p>
                      )}
                      {visibleFields.includes("createdAt") && (
                        <p className="text-gray-600 break-words">
                          <b>Created At:</b> {formatDate(item.createdAt)}
                        </p>
                      )}
                      {visibleFields.includes("role") && (
                        <p className="text-gray-600 break-words">
                          <b>Role:</b> {item.role}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleActionClick(item.id)}
                        className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center"
                      >
                        i
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // List View
            <div className="flex flex-col gap-4">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 shadow-md hover:shadow-lg transition w-full flex flex-col md:flex-row md:items-center justify-between"
                >
                  <div className="space-y-2">
                    {visibleFields.includes("name") && (
                      <h2 className="font-bold text-lg mb-2 break-words">
                        {item.name}
                      </h2>
                    )}
                    {visibleFields.includes("email") && (
                      <p className="text-gray-600 break-words">
                        <b>Email:</b> {item.email}
                      </p>
                    )}
                    {visibleFields.includes("phone") && (
                      <p className="text-gray-600 break-words">
                        <b>Mobile Number:</b> {item.phone || "N/A"}
                      </p>
                    )}
                    {visibleFields.includes("dob") && (
                      <p className="text-gray-600 break-words">
                        <b>Date of Birth:</b>{" "}
                        {item.dob !== "-" ? formatDate(item.dob) : item.dob}
                      </p>
                    )}
                    {visibleFields.includes("createdAt") && (
                      <p className="text-gray-600 break-words">
                        <b>Created At:</b> {formatDate(item.createdAt)}
                      </p>
                    )}
                    {visibleFields.includes("role") && (
                      <p className="text-gray-600 break-words">
                        <b>Role:</b> {item.role}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button
                      onClick={() => handleActionClick(item.id)}
                      className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center"
                    >
                      i
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-lg">No user found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRoutes(UserManagement);
