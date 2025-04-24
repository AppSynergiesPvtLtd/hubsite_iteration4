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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const UserManagement = () => {
  const { t } = useTranslation('admin')
  const [sortOrder, setSortOrder] = useState('Descending')
  const [tempSortOrder, setTempSortOrder] = useState('Descending')
  const [userData, setUserData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [viewStyle, setViewStyle] = useState('Table View')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSortModalOpen, setIsSortModalOpen] = useState(false)
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const dataFields = [
    { key: 'name', label: t('userManagement.name') },
    { key: 'email', label: t('userManagement.email') },
    { key: 'phone', label: t('userManagement.mobileNumber') },
    { key: 'dob', label: t('userManagement.dateOfBirth') },
    { key: 'createdAt', label: t('userManagement.createdAt') },
    { key: 'role', label: t('userManagement.role') },
  ]

  const dispatch = useDispatch()
  const excelClicked = useSelector((state) => state.adminbtn.excelClicked)

  useEffect(() => {
    dispatch(setTitle(t('userManagement.title')))
    dispatch(
      showRefresh({
        label: t('userManagement.refresh'),
        redirectTo: router.asPath,
      })
    )
    dispatch(
      showExcel({
        label: t('userManagement.generateExcel'),
        actionType: 'GENERATE_EXCEL',
      })
    )

    return () => {
      dispatch(hideAdd())
      dispatch(hideRefresh())
      dispatch(hideExcel())
      dispatch(clearTitle())
    }
  }, [dispatch, router.asPath, t])

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleGenerateExcel = () => {
    const formattedData = userData.map((user) => ({
      ...user,
      createdAt: formatDate(user.createdAt),
      dob: user.dob && user.dob !== '-' ? formatDate(user.dob) : user.dob,
    }))
    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'UserManagement')
    XLSX.writeFile(workbook, 'UserManagement.xlsx')
  }

  useEffect(() => {
    if (excelClicked) {
      handleGenerateExcel()
      dispatch(resetExcel())
    }
  }, [excelClicked, dispatch])

  const [visibleFields, setVisibleFields] = useState(
    dataFields.map((field) => field.key)
  )

  const toggleVisibleField = (fieldKey) => {
    setVisibleFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((key) => key !== fieldKey)
        : [...prev, fieldKey]
    )
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/all?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            'x-api-key': API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      const { data, total } = response.data
      const transformedData = data.map((user) => ({
        ...user,
        dob: user.dob || '-',
      }))
      const sortedData = [...transformedData].sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        return sortOrder === 'Ascending' ? dateA - dateB : dateB - dateA
      })
      setUserData(sortedData)
      setTotalUsers(total)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, itemsPerPage])

  const handleSearch = (e) => setSearchTerm(e.target.value)

  const handleApplySort = () => {
    setSortOrder(tempSortOrder)
    const sortedData = [...userData].sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return tempSortOrder === 'Ascending' ? dateA - dateB : dateB - dateA
    })
    setUserData(sortedData)
    setIsSortModalOpen(false)
  }

  const filteredData = userData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone && item.phone.includes(searchTerm))
  )

  const handleActionClick = (id) => {
    console.log(`Action button clicked for user with ID: ${id}`)
    router.push(`/admin/userinformation/${id}`)
  }

  // Pagination Calculations
  const totalPages = Math.ceil(totalUsers / itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5 // Adjust this to show more/less pages
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  return (
    <div className='p-4'>
      {/* Filters and Controls */}
      <div className='flex flex-wrap items-center justify-between mb-6 gap-4'>
        <div className='flex-grow relative w-full sm:w-auto'>
          <input
            type='text'
            placeholder={t('userManagement.searchPlaceholder')}
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
            {t('userManagement.sort')}
            {sortOrder !== 'Descending' && (
              <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
            )}
          </button>
        </div>
      </div>

      {/* Pills for Data Fields */}
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

      {/* Sort Modal */}
      {isSortModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30'>
          <div className='w-96 bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>
                {t('userManagement.sort')}
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
                {t('userManagement.sortByCreatedDate')}
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
                    {t('userManagement.ascending')}
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
                    {t('userManagement.descending')}
                  </span>
                </label>
              </div>
            </div>
            <div className='flex items-center justify-end gap-3'>
              <button
                onClick={() => setTempSortOrder('Descending')}
                className='px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100'
              >
                {t('userManagement.clear')}
              </button>
              <button
                onClick={handleApplySort}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
              >
                {t('userManagement.apply')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Data Display */}
      <div className=''>
        {loading ? (
          <div className='flex justify-center items-center h-32'>
            <p className='text-gray-500 text-lg'>
              {t('userManagement.loading')}
            </p>
          </div>
        ) : filteredData.length > 0 ? (
          <>
            {viewStyle === 'Table View' ? (
              <div className='w-full overflow-auto'>
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
                        {t('userManagement.action')}
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
                            <td
                              key={field.key}
                              className='py-3 px-4 break-words'
                            >
                              {field.key === 'createdAt'
                                ? formatDate(item.createdAt)
                                : field.key === 'dob' && item.dob !== '-'
                                ? formatDate(item.dob)
                                : item[field.key] || '-'}
                            </td>
                          ))}
                        <td className='py-3 px-4 text-right'>
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
              <div className='overflow-x-auto'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2'>
                  {filteredData.map((item) => (
                    <div
                      key={item.id}
                      className='border rounded-lg p-4 shadow-md hover:shadow-lg transition w-full flex flex-col justify-between'
                    >
                      <div>
                        {visibleFields.includes('name') && (
                          <h2 className='font-bold text-lg mb-2 break-words'>
                            {item.name}
                          </h2>
                        )}
                        {visibleFields.includes('email') && (
                          <p className='text-gray-600 break-words'>
                            <b>{t('userManagement.email')}:</b> {item.email}
                          </p>
                        )}
                        {visibleFields.includes('phone') && (
                          <p className='text-gray-600 break-words'>
                            <b>{t('userManagement.mobileNumber')}:</b>{' '}
                            {item.phone || 'N/A'}
                          </p>
                        )}
                        {visibleFields.includes('dob') && (
                          <p className='text-gray-600 break-words'>
                            <b>{t('userManagement.dateOfBirth')}:</b>{' '}
                            {item.dob !== '-' ? formatDate(item.dob) : item.dob}
                          </p>
                        )}
                        {visibleFields.includes('createdAt') && (
                          <p className='text-gray-600 break-words'>
                            <b>{t('userManagement.createdAt')}:</b>{' '}
                            {formatDate(item.createdAt)}
                          </p>
                        )}
                        {visibleFields.includes('role') && (
                          <p className='text-gray-600 break-words'>
                            <b>{t('userManagement.role')}:</b> {item.role}
                          </p>
                        )}
                      </div>
                      <div className='mt-4 flex justify-end'>
                        <button
                          onClick={() => handleActionClick(item.id)}
                          className='w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center'
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
              <div className='flex flex-col gap-4'>
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className='border rounded-lg p-4 shadow-md hover:shadow-lg transition w-full flex flex-col md:flex-row md:items-center justify-between'
                  >
                    <div className='space-y-2'>
                      {visibleFields.includes('name') && (
                        <h2 className='font-bold text-sm mb-2 break-words'>
                          {item.name}
                        </h2>
                      )}
                      {visibleFields.includes('email') && (
                        <p className='text-gray-600 break-words'>
                          <b>{t('userManagement.email')}:</b> {item.email}
                        </p>
                      )}
                      {visibleFields.includes('phone') && (
                        <p className='text-gray-600 break-words'>
                          <b>{t('userManagement.mobileNumber')}:</b>{' '}
                          {item.phone || 'N/A'}
                        </p>
                      )}
                      {visibleFields.includes('dob') && (
                        <p className='text-gray-600 break-words'>
                          <b>{t('userManagement.dateOfBirth')}:</b>{' '}
                          {item.dob !== '-' ? formatDate(item.dob) : item.dob}
                        </p>
                      )}
                      {visibleFields.includes('createdAt') && (
                        <p className='text-gray-600 break-words'>
                          <b>{t('userManagement.createdAt')}:</b>{' '}
                          {formatDate(item.createdAt)}
                        </p>
                      )}
                      {visibleFields.includes('role') && (
                        <p className='text-gray-600 break-words'>
                          <b>{t('userManagement.role')}:</b> {item.role}
                        </p>
                      )}
                    </div>
                    <div className='mt-4 md:mt-0'>
                      <button
                        onClick={() => handleActionClick(item.id)}
                        className='w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center'
                      >
                        i
                      </button>
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
                &lt;
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
                &gt;
              </button>
            </div>
          </>
        ) : (
          <div className='flex justify-center items-center h-32'>
            <p className='text-gray-500 text-lg'>
              {t('userManagement.noUserFound')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminRoutes(UserManagement)

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}
