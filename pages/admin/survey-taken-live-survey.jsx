import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import AdminRoutes from "../adminRoutes";
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
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const SurveyTakenLiveSurvey = () => {
  const { t } = useTranslation('admin')
  const [surveyData, setSurveyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStyle, setViewStyle] = useState("Table View");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("Descending");
  const [tempSortOrder, setTempSortOrder] = useState("Descending");
  const [loading, setLoading] = useState(false);
  const [totalSurveys, setTotalSurveys] = useState(0); // Added to track total surveys
  const router = useRouter();
  const dispatch = useDispatch();

  const excelClicked = useSelector((state) => state.adminbtn.excelClicked);

  useEffect(() => {
    dispatch(setTitle(t('surveyTakenLiveSurvey.pageTitle')))
    dispatch(showRefresh({ label: 'Refresh', redirectTo: router.asPath }))
    dispatch(
      showExcel({ label: 'Generate Excel', actionType: 'GENERATE_EXCEL' })
    )

    return () => {
      dispatch(hideAdd())
      dispatch(hideRefresh())
      dispatch(hideExcel())
      dispatch(clearTitle())
    }
  }, [dispatch, router.asPath, t])

  const handleGenerateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(surveyData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SurveyTaken");
    XLSX.writeFile(workbook, "SurveyTaken.xlsx");
  };

  useEffect(() => {
    if (excelClicked) {
      handleGenerateExcel();
      dispatch(resetExcel());
    }
  }, [excelClicked, dispatch]);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/live-survey/?isActive=true&page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data, total } = response.data; // Assuming API returns total
      const sortedData = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setSurveyData(sortedData);
      setTotalSurveys(total); // Set total surveys for pagination
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

  const handleApplySort = () => {
    setSortOrder(tempSortOrder);
    const sortedData = [...surveyData].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return tempSortOrder === "Ascending" ? dateA - dateB : dateB - dateA;
    });
    setSurveyData(sortedData);
    setIsSortModalOpen(false);
  };

  const handleClearSort = () => {
    setTempSortOrder("Descending");
    setSortOrder("Descending");
    const sortedData = [...surveyData].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setSurveyData(sortedData);
  };

  const filteredData = surveyData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionClick = (id) => {
    console.log(`Action clicked for survey ID: ${id}`);
    router.push(`/admin/live-survey-completions/${id}`);
  };

  // Pagination Calculations
  const totalPages = Math.ceil(totalSurveys / itemsPerPage);

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
    <div className='p-4 max-w-full'>
      {/* Filters and Controls */}
      <div className='flex flex-wrap items-center justify-between mb-6 gap-4'>
        <div className='flex-grow relative w-full sm:w-auto'>
          <input
            type='text'
            placeholder={t('surveyTakenLiveSurvey.searchPlaceholder')}
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
            <option>{t('surveyTakenLiveSurvey.tableView')}</option>
            <option>{t('surveyTakenLiveSurvey.gridView')}</option>
            <option>{t('surveyTakenLiveSurvey.listView')}</option>
          </select>

          <button
            onClick={() => setIsSortModalOpen(true)}
            className='relative px-4 py-2 text-sm font-medium border border-gray-300 rounded-full bg-gray-100 flex items-center justify-center focus:outline-none'
          >
            <img src='/Filter.svg' alt='Sort' className='w-5 h-5 mr-2' />
            {t('surveyTakenLiveSurvey.sort')}
            {sortOrder !== 'Descending' && (
              <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
            )}
          </button>
        </div>
      </div>

      {/* Sort Modal */}
      {isSortModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30'>
          <div className='w-96 bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>
                {t('surveyTakenLiveSurvey.sort')}
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
                {t('surveyTakenLiveSurvey.sortByCreatedDate')}
              </p>
              <div className='flex flex-col gap-3'>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    className='form-radio rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    checked={tempSortOrder === 'Ascending'}
                    onChange={() => setTempSortOrder('Ascending')}
                  />
                  <span className='text-sm text-gray-700'>
                    {t('surveyTakenLiveSurvey.ascending')}
                  </span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    className='form-radio rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                    checked={tempSortOrder === 'Descending'}
                    onChange={() => setTempSortOrder('Descending')}
                  />
                  <span className='text-sm text-gray-700'>
                    {t('surveyTakenLiveSurvey.descending')}
                  </span>
                </label>
              </div>
            </div>
            <div className='flex items-center justify-end gap-3'>
              <button
                onClick={handleClearSort}
                className='px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100'
              >
                {t('surveyTakenLiveSurvey.clear')}
              </button>
              <button
                onClick={handleApplySort}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
              >
                {t('surveyTakenLiveSurvey.apply')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Survey Data */}
      <div className='overflow-auto'>
        {loading ? (
          <div className='flex justify-center items-center h-32'>
            <p className='text-gray-500 text-lg'>
              {t('surveyTakenLiveSurvey.loading')}
            </p>
          </div>
        ) : filteredData.length > 0 ? (
          <>
            {viewStyle === 'Table View' ? (
              <div className='w-[90vw] md:w-full overflow-auto'>
                <table className='w-full text-left'>
                  <thead>
                    <tr className='text-sm text-gray-600 font-medium'>
                      <th className='py-3 px-4'>
                        {t('surveyTakenLiveSurvey.sNo')}
                      </th>
                      <th className='py-3 px-4'>
                        {t('surveyTakenLiveSurvey.title')}
                      </th>
                      <th className='py-3 px-4'>
                        {t('surveyTakenLiveSurvey.description')}
                      </th>
                      <th className='py-3 px-4'>
                        {t('surveyTakenLiveSurvey.hubCoins')}
                      </th>
                      <th className='py-3 px-4'>
                        {t('surveyTakenLiveSurvey.createdAt')}
                      </th>
                      <th className='py-3 px-4'>
                        {t('surveyTakenLiveSurvey.action')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className='text-sm text-gray-800'>
                    {filteredData.map((item, index) => (
                      <tr key={item.id} className='hover:bg-gray-100'>
                        <td className='py-3 px-4'>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className='py-3 px-4'>{item.title}</td>
                        <td className='py-3 px-4'>{item.description}</td>
                        <td className='py-3 px-4'>{item.hubCoins}</td>
                        <td className='py-3 px-4'>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className='py-3 px-4 text-center'>
                          <button
                            onClick={() => handleActionClick(item.id)}
                            className='w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center'
                          >
                            i
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
                    className='relative border rounded-lg p-4 pt-10 shadow-md hover:shadow-lg transition'
                  >
                    <button
                      onClick={() => handleActionClick(item.id)}
                      className='absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs'
                    >
                      i
                    </button>
                    <h2 className='font-bold text-lg mb-2'>{item.title}</h2>
                    <p className='text-gray-600 mb-1'>
                      <b>Description:</b> {item.description}
                    </p>
                    <p className='text-gray-600 mb-1'>
                      <b>Hub Coins:</b> {item.hubCoins}
                    </p>
                    <p className='text-gray-600'>
                      <b>Created:</b>{' '}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className='flex flex-col gap-4'>
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className='relative border rounded-lg p-4 pt-10 shadow-md hover:shadow-lg transition flex flex-col sm:flex-row justify-between items-start'
                  >
                    <button
                      onClick={() => handleActionClick(item.id)}
                      className='absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs'
                    >
                      i
                    </button>
                    <div className='w-full'>
                      <h2 className='font-bold text-lg mb-1'>{item.title}</h2>
                      <p className='text-gray-600 mb-1'>
                        <b>Description:</b> {item.description}
                      </p>
                      <p className='text-gray-600 mb-1'>
                        <b>Hub Coins:</b> {item.hubCoins}
                      </p>
                      <p className='text-gray-600'>
                        <b>Created:</b>{' '}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <div className='flex justify-center items-center mt-6'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-2 py-1 mx-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
              >
                «
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 mx-1 text-sm border border-gray-300 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='px-2 py-1 mx-1 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
              >
                »
              </button>
            </div>
          </>
        ) : (
          <div className='flex justify-center items-center h-32'>
            <p className='text-gray-500 text-lg'>
              {t('surveyTakenLiveSurvey.noSurveysFound')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
};

export default AdminRoutes(SurveyTakenLiveSurvey);

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'admin'])),
  },
})