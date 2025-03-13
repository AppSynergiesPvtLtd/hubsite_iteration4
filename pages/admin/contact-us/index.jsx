import { useState, useEffect } from "react";
import axios from "axios";
import AdminRoutes from "@/pages/adminRoutes";
import * as XLSX from "xlsx";
import { Trash2, X, AlertCircle } from "lucide-react";
import { useRouter } from "next/router";
import Layout from "../layout";
import { useDispatch, useSelector } from "react-redux";
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

// Reusable confirmation modal component.
export const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-lg font-semibold mb-4">{message}</h3>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const Contactus = () => {
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStyle, setViewStyle] = useState("Table View");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [tempSortOrder, setTempSortOrder] = useState("");
  const [tempSelectedSubjects, setTempSelectedSubjects] = useState([]);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const router = useRouter();

  // Data fields to display.
  const dataFields = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "message", label: "Message" },
    { key: "createdAt", label: "Created At" },
  ];

  const dispatch = useDispatch();
  const excelClicked = useSelector((state) => state.adminbtn.excelClicked);

  useEffect(() => {
    dispatch(setTitle("Contact Us"));
    dispatch(
      showExcel({ label: "Generate Excel", actionType: "GENERATE_EXCEL" })
    );
    dispatch(showRefresh({ label: "Refresh", redirectTo: router.asPath }));

    return () => {
      dispatch(hideAdd());
      dispatch(hideRefresh());
      dispatch(hideExcel());
      dispatch(clearTitle());
    };
  }, [dispatch, router.asPath]);

  const handleGenerateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ContactMessages");
    XLSX.writeFile(workbook, "ContactMessages.xlsx");
  };

  useEffect(() => {
    if (excelClicked) {
      handleGenerateExcel();
      dispatch(resetExcel());
    }
  }, [excelClicked, dispatch]);

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

  const subjects = [
    "General Inquiry",
    "Technical Support",
    "Customer Support",
    "Other Inquiry",
  ];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const payload = {
        sort:
          sortOrder === "Ascending"
            ? "asc"
            : sortOrder === "Descending"
            ? "desc"
            : undefined,
        subjects: selectedSubjects.length ? selectedSubjects : undefined,
        limit: itemsPerPage,
        page: currentPage,
      };
      const response = await axios.post(`${baseUrl}/contact-us/filter`, payload, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { data, total } = response.data;
      setUserData(data);
      setTotalUsers(total);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, sortOrder, selectedSubjects]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleTempSubjectToggle = (subject) => {
    setTempSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleClearTempFilters = () => {
    setTempSelectedSubjects([]);
    setTempSortOrder("");
  };

  const handleApplyFilters = () => {
    setSelectedSubjects(tempSelectedSubjects);
    setSortOrder(tempSortOrder);
    setIsSortModalOpen(false);
  };

  const filteredData = userData.filter(
    (item) =>
      (searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSubjects.length === 0 || selectedSubjects.includes(item.subject))
  );

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${baseUrl}/contact-us/${id}`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();
      setAlert({
        show: true,
        message: "Message deleted successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      setAlert({
        show: true,
        message: "Error deleting message",
        type: "error",
      });
    }
  };

  const confirmDeleteHandler = async () => {
    if (confirmDelete.id) {
      await deleteMessage(confirmDelete.id);
      setConfirmDelete({ show: false, id: null });
    }
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

  // Alert component.
  const AlertComponent = ({ message, type }) => (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-md flex items-center space-x-2 ${
        type === "error"
          ? "bg-red-100 text-red-900"
          : "bg-green-100 text-green-900"
      }`}
    >
      <AlertCircle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );

  // Pagination Calculations
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Adjust to show more/less pages
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="p-4">
      {alert.show && (
        <AlertComponent message={alert.message} type={alert.type} />
      )}

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
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
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

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

          <button
            onClick={() => {
              setTempSelectedSubjects(selectedSubjects);
              setTempSortOrder(sortOrder);
              setIsSortModalOpen(true);
            }}
            className="relative px-4 py-2 text-sm font-medium border border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
          >
            Sort
            {(selectedSubjects.length > 0 || sortOrder) && (
              <span className="absolute top-0 right-0 mt-1 mr-1 w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Pills for Toggling Data Fields */}
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
          <>
            {viewStyle === "Table View" ? (
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
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-800">
                    {filteredData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-100">
                        <td className="py-3 px-4">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        {dataFields
                          .filter((field) => visibleFields.includes(field.key))
                          .map((field) => (
                            <td
                              key={field.key}
                              className="py-3 px-4 break-words"
                            >
                              {field.key === "createdAt"
                                ? new Date(item.createdAt).toLocaleDateString()
                                : item[field.key]}
                            </td>
                          ))}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setConfirmDelete({ show: true, id: item.id })
                              }
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
              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-2">
                  {filteredData.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 shadow-md hover:shadow-lg transition w-full flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        {visibleFields.includes("name") && (
                          <h2 className="font-bold text-lg break-words">
                            {item.name}
                          </h2>
                        )}
                        {visibleFields.includes("email") && (
                          <p className="text-gray-600 break-words">
                            <b>Email:</b> {item.email}
                          </p>
                        )}
                        {visibleFields.includes("message") && (
                          <p className="text-gray-600 break-words">
                            <b>Message:</b> {item.message}
                          </p>
                        )}
                        {visibleFields.includes("createdAt") && (
                          <p className="text-gray-600 break-words">
                            <b>Created:</b>{" "}
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() =>
                            setConfirmDelete({ show: true, id: item.id })
                          }
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
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
                        <h2 className="font-bold text-lg break-words">
                          {item.name}
                        </h2>
                      )}
                      {visibleFields.includes("email") && (
                        <p className="text-gray-600 break-words">
                          <b>Email:</b> {item.email}
                        </p>
                      )}
                      {visibleFields.includes("message") && (
                        <p className="text-gray-600 break-words">
                          <b>Message:</b> {item.message}
                        </p>
                      )}
                      {visibleFields.includes("createdAt") && (
                        <p className="text-gray-600 break-words">
                          <b>Created:</b>{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 md:mt-0">
                      <button
                        onClick={() =>
                          setConfirmDelete({ show: true, id: item.id })
                        }
                        className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6">
              
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 mx-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                «
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 mx-1 text-sm border border-gray-300 rounded-md ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 mx-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                »
              </button>
             
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 text-lg">No messages found</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Deletion */}
      {confirmDelete.show && (
        <ConfirmationModal
          message="Are you sure you want to delete this message?"
          onConfirm={confirmDeleteHandler}
          onCancel={() => setConfirmDelete({ show: false, id: null })}
        />
      )}
    </div>
  );
};

export default AdminRoutes(Contactus);