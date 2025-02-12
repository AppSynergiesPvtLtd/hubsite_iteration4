import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">

      <h1 className="text-orange-500 text-[100px] md:text-[180px] font-extrabold">
        404
      </h1>

      <h2 className="text-orange-500 text-3xl md:text-5xl font-extrabold text-center">
        Page Not Found
      </h2>

      <p className="text-[#797979] mt-2 text-center w-full max-w-md md:max-w-lg">
        The page you're looking for seems to have gone on an adventure of its own.
        But don't worry, we'll help you get back on track.
      </p>

      <button
        onClick={() => (window.location.href = "/")}
        className="mt-6 px-4 py-2 md:px-6 md:py-3 bg-[#0057A1] text-white font-semibold rounded-full hover:bg-blue-700"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
