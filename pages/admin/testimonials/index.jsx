import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/pages/dashboard/layout";
import AdminRoutes from "@/pages/adminRoutes";
import * as XLSX from "xlsx";
import Filter from "../../../public/Filter.svg";
import { useRouter } from "next/router";
import {
  clearTitle,
  hideAdd,
  hideExcel,
  hideRefresh,
  resetExcel,
  setTitle,
  showAdd,
  showExcel,
  showRefresh,
} from "@/store/adminbtnSlice";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Edit2 } from "lucide-react";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const TestimonialManagement = () => {
  const [testimonialData, setTestimonialData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStyle, setViewStyle] = useState("Table View");
  const [itemsPerPage] = useState(10); // Fixed to 2 as per API requirement
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState(""); // Default empty, can be "Ascending" or "Descending"
  const [loading, setLoading] = useState(false);
  const [totalTestimonials, setTotalTestimonials] = useState(0); // Added to track total testimonials
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation('admin')

  const excelClicked = useSelector((state) => state.adminbtn.excelClicked);

  const dataFields = [
    { key: 'name', label: t('testimonialManagement.name') },
    { key: 'city', label: t('testimonialManagement.city') },
    { key: 'comment', label: t('testimonialManagement.comment') },
    { key: 'createdAt', label: t('testimonialManagement.createdAt') },
    { key: 'rating', label: t('testimonialManagement.rating') },
    { key: 'image', label: t('testimonialManagement.image') },
  ]

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);

  const openDeleteModal = (testimonialId) => {
    setTestimonialToDelete(testimonialId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setTestimonialToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!testimonialToDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/testimonial/${testimonialToDelete}`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchTestimonials();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      closeDeleteModal();
    }
  };

  useEffect(() => {
    dispatch(setTitle(t('testimonialManagement.title')))
    dispatch(
      showRefresh({
        label: t('testimonialManagement.refresh'),
        redirectTo: router.asPath,
      })
    )
    dispatch(
      showExcel({
        label: t('testimonialManagement.generateExcel'),
        actionType: 'GENERATE_EXCEL',
      })
    )
    dispatch(
      showAdd({
        label: t('testimonialManagement.add'),
        redirectTo: '/admin/testimonials/add-testimonials',
      })
    )
    return () => {
      dispatch(hideAdd())
      dispatch(hideRefresh())
      dispatch(hideExcel())
      dispatch(clearTitle())
    }
  }, [dispatch, router.asPath, t])

  const handleGenerateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(testimonialData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Testimonials");
    XLSX.writeFile(workbook, "Testimonials.xlsx");
  };

  useEffect(() => {
    if (excelClicked) {
      handleGenerateExcel();
      dispatch(resetExcel());
    }
  }, [excelClicked, dispatch]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const payload = {
        sort:
          sortOrder === 'Ascending'
            ? 'asc'
            : sortOrder === 'Descending'
            ? 'desc'
            : undefined,
        limit: itemsPerPage,
        page: currentPage,
      }
      const response = await axios.post(
        `${API_BASE_URL}/testimonial/filter`,
        payload,
        {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data, total } = response.data; // Assuming API returns data and total
      const transformedData = data.map((testimonial) => ({
        ...testimonial,
        createdAt: testimonial.createdAt,
      }));
      setTestimonialData(transformedData);
      setTotalTestimonials(total); // Set total testimonials for pagination
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, itemsPerPage, sortOrder]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleSort = (order) => {
    setSortOrder(order);
    // Sorting is handled server-side via the API payload, so no need to sort locally
  };

  const filteredData = testimonialData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.city &&
        item.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.comment &&
        item.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination Calculations
  const totalPages = Math.ceil(totalTestimonials / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='p-4'>
      <div className='flex flex-wrap items-center justify-between mb-6 gap-4'>
        <div className='flex-grow relative w-full sm:w-auto'>
          <input
            type='text'
            placeholder={t('testimonialManagement.searchPlaceholder')}
            className='w-full px-4 py-2 text-sm border border-gray-300 rounded-full bg-white focus:outline-none'
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-4 w-full sm:w-auto'>
          <select
            className='px-4 py-2 text-sm border border-gray-300 rounded-full bg-gray-100 text-gray-600 focus:outline-none'
            value={viewStyle}
            onChange={(e) => setViewStyle(e.target.value)}
          >
            <option>Table View</option>
            <option>Grid View</option>
            <option>List View</option>
          </select>

          <button
            onClick={() => setIsSortModalOpen(true)}
            className='relative px-4 py-2 gap-2 text-sm font-medium border border-gray-300 rounded-full bg-gray-100 flex items-center justify-center focus:outline-none'
          >
            <Filter />
            {t('testimonialManagement.sort')}
            {sortOrder && (
              <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
            )}
          </button>
        </div>
      </div>

      <div className='flex flex-wrap gap-2 mb-4 overflow-x-auto'>
        {dataFields.map((field) => (
          <button
            key={field.key}
            onClick={() => toggleVisibleField(field.key)}
            className={`px-3 py-1 text-sm rounded-full border whitespace-nowrap ${
              visibleFields.includes(field.key)
                ? 'bg-[#0057A1] text-white border-blue-500'
                : 'bg-gray-200 text-gray-800 border-gray-200'
            }`}
          >
            {field.label}
          </button>
        ))}
      </div>

      {isSortModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50'>
          <div className='w-96 bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>
                {t('testimonialManagement.sort')}
              </h3>
              <button
                onClick={() => setIsSortModalOpen(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                ✕
              </button>
            </div>
            <div className='mb-6'>
              <p className='text-sm text-gray-600 mb-3'>
                {t('testimonialManagement.sortByCreatedDate')}
              </p>
              <div className='flex flex-col gap-3'>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    className='form-radio rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    checked={sortOrder === 'Ascending'}
                    onChange={() => handleSort('Ascending')}
                  />
                  <span className='text-sm text-gray-700'>
                    {t('testimonialManagement.ascending')}
                  </span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    className='form-radio rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    checked={sortOrder === 'Descending'}
                    onChange={() => handleSort('Descending')}
                  />
                  <span className='text-sm text-gray-700'>
                    {t('testimonialManagement.descending')}
                  </span>
                </label>
              </div>
            </div>
            <div className='flex items-center justify-end gap-3'>
              <button
                onClick={() => {
                  setSortOrder('')
                  fetchTestimonials() // Refetch with no sort order
                }}
                className='px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100'
              >
                {t('testimonialManagement.clear')}
              </button>
              <button
                onClick={() => setIsSortModalOpen(false)}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
              >
                {t('testimonialManagement.apply')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {loading ? (
          <div className='flex justify-center items-center h-32'>
            <p className='text-gray-500 text-lg'>
              {t('testimonialManagement.loading')}
            </p>
          </div>
        ) : filteredData.length > 0 ? (
          <>
            {viewStyle === 'Table View' ? (
              <div className='w-[90vw] md:w-full overflow-scroll md:overflow-hidden'>
                <table className='w-full text-left'>
                  <thead>
                    <tr className='text-sm text-gray-600 font-medium'>
                      <th className='py-3 px-4'>S. NO</th>
                      {dataFields
                        .filter((field) => visibleFields.includes(field.key))
                        .map((field) => (
                          <th key={field.key} className='py-3 px-4'>
                            {field.label}
                          </th>
                        ))}
                      <th className='py-3 px-4'>
                        {t('testimonialManagement.action')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='text-sm text-gray-800'>
                    {filteredData.map((item, index) => (
                      <tr key={item.id} className='hover:bg-gray-100'>
                        <td className='py-3 px-4'>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        {dataFields
                          .filter((field) => visibleFields.includes(field.key))
                          .map((field) => (
                            <td key={field.key} className='py-3 px-4'>
                              {field.key === 'createdAt' ? (
                                new Date(item.createdAt).toLocaleDateString()
                              ) : field.key === 'image' ? (
                                item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className='w-10 h-10 object-cover rounded-full'
                                  />
                                ) : (
                                  'N/A'
                                )
                              ) : (
                                item[field.key] || '-'
                              )}
                            </td>
                          ))}
                        <td className='py-3 px-4 flex items-center'>
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/testimonials/add-testimonials?id=${item.id}`
                              )
                            }
                            className='text-blue-600 hover:text-blue-800'
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(item.id)}
                            className='ml-2 text-red-600 hover:text-red-800'
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : viewStyle === 'Grid View' ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className='border rounded-lg p-4 shadow-md hover:shadow-lg transition relative'
                  >
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/testimonials/add-testimonials?id=${item.id}`
                        )
                      }
                      className='absolute top-2 right-10 text-blue-600 hover:text-blue-800'
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(item.id)}
                      className='absolute top-2 right-2 text-red-600 hover:text-red-800'
                    >
                      <Trash2 size={20} />
                    </button>
                    {visibleFields.includes('image') &&
                      (item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className='w-16 h-16 object-cover rounded-full mt-2'
                        />
                      ) : (
                        <p className='text-gray-600 font-bold'>Img: N/A</p>
                      ))}
                    {visibleFields.includes('name') && (
                      <h2 className='font-bold text-lg mb-2'>{item.name}</h2>
                    )}
                    {visibleFields.includes('city') && (
                      <p className='text-gray-600'>
                        <b>{t('testimonialManagement.city')}:</b> {item.city}
                      </p>
                    )}
                    {visibleFields.includes('comment') && (
                      <p className='text-gray-600'>
                        <b>{t('testimonialManagement.comment')}:</b>{' '}
                        {item.comment}
                      </p>
                    )}
                    {visibleFields.includes('createdAt') && (
                      <p className='text-gray-600'>
                        <b>{t('testimonialManagement.createdAt')}:</b>{' '}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    {visibleFields.includes('rating') && (
                      <p className='text-gray-600'>
                        <b>{t('testimonialManagement.rating')}:</b>{' '}
                        {item.rating}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col gap-4'>
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className='border rounded-lg p-4 shadow-md hover:shadow-lg transition relative'
                  >
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/testimonials/add-testimonials?id=${item.id}`
                        )
                      }
                      className='absolute top-2 right-10 text-blue-600 hover:text-blue-800'
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(item.id)}
                      className='absolute top-2 right-2 text-red-600 hover:text-red-800'
                    >
                      <Trash2 size={20} />
                    </button>
                    {visibleFields.includes('image') &&
                      (item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className='w-16 h-16 object-cover rounded-full mt-2'
                        />
                      ) : (
                        <p className='text-gray-600 font-bold'>Img: N/A</p>
                      ))}
                    {visibleFields.includes('name') && (
                      <h2 className='font-bold text-lg mb-2'>{item.name}</h2>
                    )}
                    {visibleFields.includes('city') && (
                      <p className='text-gray-600'>
                        <b>{t('testimonialManagement.city')}:</b> {item.city}
                      </p>
                    )}
                    {visibleFields.includes('comment') && (
                      <p className='text-gray-600'>
                        <b>{t('testimonialManagement.comment')}:</b>{' '}
                        {item.comment}
                      </p>
                    )}
                    {visibleFields.includes('createdAt') && (
                      <p className='text-gray-600'>
                        <b>{t('testimonialManagement.createdAt')}:</b>{' '}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    {visibleFields.includes('rating') && (
                      <p className='text-gray-600'>
                        <b>{t('testimonialManagement.rating')}:</b>{' '}
                        {item.rating}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Updated Pagination Controls */}
            <div className='flex flex-col items-center mt-6'>
              <p className='text-sm text-gray-700 mb-2'>Take survey 5 mins</p>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50'
                >
                  &lt;
                </button>
                <button className='w-8 h-8 flex items-center justify-center border border-blue-500 rounded-md bg-blue-500 text-white'>
                  {currentPage}
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50'
                >
                  &gt;
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className='flex justify-center items-center h-32'>
            <p className='text-gray-500 text-lg'>
              {t('testimonialManagement.noUserFound')}
            </p>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-96'>
            <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
            <p className='mb-6'>
              Are you sure you want to delete this testimonial?
            </p>
            <div className='flex justify-end gap-4'>
              <button
                onClick={closeDeleteModal}
                className='px-4 py-2 text-sm border rounded-md'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className='px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

export default AdminRoutes(TestimonialManagement);

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}
