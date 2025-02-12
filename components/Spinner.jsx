import React from 'react'

const Spinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="flex flex-col items-center">
      <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      <p className="mt-2 text-gray-700">Verifying your session, please wait...</p>
    </div>
  </div>
  )
}

export default Spinner