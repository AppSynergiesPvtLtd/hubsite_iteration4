import { useState, useEffect } from "react";
import axios from "axios";
import AdminRoutes from "@/pages/adminRoutes";
import * as XLSX from "xlsx";
import { Trash2, X, AlertCircle } from "lucide-react";
import { useRouter } from "next/router";
import Layout from "../layout";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmationModal } from "../contact-us";
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

const Newsletter = () => {
  // Main UI states
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStyle, setViewStyle] = useState("Table View");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // States for deletion confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);

  // States for filter/sort modal
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  // This is the "applied" filter state used in API requests.
  const [sortOrder, setSortOrder] = useState("");
  // This temporary state holds the sort filter inside the modal.
  const [tempSortOrder, setTempSortOrder] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  // Get the Excel trigger flag from Redux.
  const excelClicked = useSelector((state) => state.adminbtn.excelClicked);

  // Set header title and show Excel button on mount.
  useEffect(() => {
    dispatch(setTitle("Newsletter"));
    dispatch(showExcel({ label: "Generate Excel", actionType: "GENERATE_EXCEL" }));
    dispatch(showRefresh({ label: "Refresh", redirectTo: router.asPath }));
    
    return () => {
      dispatch(hideAdd());
      dispatch(hideRefresh());
      dispatch(hideExcel());
      dispatch(clearTitle());
    };
  }, [dispatch, router.asPath]);

  // Generate an Excel file from userData.
  const handleGenerateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NewsletterSubscribers");
    XLSX.writeFile(workbook, "NewsletterSubscribers.xlsx");
  };

  // When Excel flag is active, generate the Excel file then reset the flag.
  useEffect(() => {
    if (excelClicked) {
      handleGenerateExcel();
      dispatch(resetExcel());
    }
  }, [excelClicked, dispatch]);

  // For this newsletter, we display only email and subscription date.
  const dataFields = [
    { key: "email", label: "Email" },
    { key: "createdAt", label: "Subscribed At" },
  ];

  // Allow toggling which columns are visible.
  const [visibleFields, setVisibleFields] = useState(
    dataFields.map((field) => field.key)
  );
  const toggleVisibleField = (fieldKey) => {
    setVisibleFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((key) => key !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  // API configuration
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  // Fetch newsletter data with applied filters.
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/newsletter/filter`,
        {
          sort:
            sortOrder === "Ascending"
              ? "asc"
              : sortOrder === "Descending"
              ? "desc"
              : undefined,
          limit: itemsPerPage,
          page: currentPage,
        },
        {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data, total } = response.data;
      setUserData(data);
      setTotalUsers(total);
    } catch (error) {
      console.error("Error fetching newsletter data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, sortOrder]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  // Clear temporary filters inside the modal.
  const handleClearTempFilters = () => {
    setTempSortOrder("");
  };

  // Apply temporary filters to the actual filter state.
  const handleApplyFilters = () => {
    setSortOrder(tempSortOrder);
    setIsSortModalOpen(false);
  };

  // Client-side filtering based on the search term.
  const filteredData = userData.filter(
    (item) =>
      searchTerm === "" ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open deletion modal.
  const handleDeleteClick = (id) => {
    setSubscriberToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Delete a subscriber after confirmation.
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/newsletter/id/${subscriberToDelete}`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();
      setAlert({
        show: true,
        message: "Subscriber deleted successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      setAlert({
        show: true,
        message: "Error deleting subscriber",
        type: "error",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSubscriberToDelete(null);
    }
  };

  // Cancel deletion.
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSubscriberToDelete(null);
  };

  const clearAlert = () => setAlert({ show: false, message: "", type: "" });

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        clearAlert();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Simple Alert component.
  const Alert = ({ message, type }) => (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-md flex items-center space-x-2 ${
        type === "error" ? "bg-red-100 text-red-900" : "bg-green-100 text-green-900"
      }`}
    >
      <AlertCircle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );

  return (
    <div className="p-4">
      {alert.show && <Alert message={alert.message} type={alert.type} />}

      {/* Search and Control Bar */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        {/* Search Bar */}
        <div className="flex-grow relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by email"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full bg-white focus:outline-none"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Style, Items per Page, and Filter & Sort Controls */}
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
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}>View 10</option>
            <option value={50}>View 50</option>
            <option value={100}>View 100</option>
          </select>

          <button
            onClick={() => {
              // Initialize temporary filter with the current applied sortOrder.
              setTempSortOrder(sortOrder);
              setIsSortModalOpen(true);
            }}
            className="relative px-4 py-2 text-sm font-medium border border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
          >
          Sort
            {sortOrder && (
              <span className="absolute top-0 right-0 mt-1 mr-1 w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Pills to Toggle Visible Data Fields */}
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

      {/* Filter & Sort Modal */}
      {isSortModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="w-96 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Sort</h3>
              <button
                onClick={() => setIsSortModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Sort Section (by Date) */}
              <div>
                <h4 className="text-sm font-medium mb-3">Sort By (Date)</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={tempSortOrder === "Ascending"}
                      onChange={() => setTempSortOrder("Ascending")}
                    />
                    <span className="text-sm text-gray-700">Ascending</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={tempSortOrder === "Descending"}
                      onChange={() => setTempSortOrder("Descending")}
                    />
                    <span className="text-sm text-gray-700">Descending</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-center gap-3 p-4 border-t">
              <button
                onClick={handleClearTempFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0057A1] rounded-md hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Display */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        ) : filteredData.length > 0 ? (
          viewStyle === "Table View" ? (
            <div className="w-[90vw] md:w-full overflow-scroll md:overflow-hidden">
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
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4">{index + 1}</td>
                      {dataFields
                        .filter((field) => visibleFields.includes(field.key))
                        .map((field) => (
                          <td key={field.key} className="py-3 px-4">
                            {field.key === "createdAt"
                              ? new Date(item.createdAt).toLocaleDateString()
                              : item[field.key]}
                          </td>
                        ))}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {visibleFields.includes("email") && (
                    <p className="text-gray-800 mb-2">
                      <strong>Email:</strong> {item.email}
                    </p>
                  )}
                  {visibleFields.includes("createdAt") && (
                    <p className="text-gray-600">
                      <strong>Subscribed:</strong>{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="flex flex-col gap-4">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 shadow-md hover:shadow-lg transition relative"
                >
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {visibleFields.includes("email") && (
                    <p className="text-gray-800 mb-2">
                      <strong>Email:</strong> {item.email}
                    </p>
                  )}
                  {visibleFields.includes("createdAt") && (
                    <p className="text-gray-600">
                      <strong>Subscribed:</strong>{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-lg">No subscribers found</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Deletion */}
      {isDeleteModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this subscriber?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default AdminRoutes(Newsletter);
