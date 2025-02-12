import React, { useState } from "react";
import Link from "next/link";

const Rewards = () => {
  // State for coins earned and history data
  const [coins, setCoins] = useState(60);
  const [history, setHistory] = useState([
    { id: 1, name: "Daily Reward 1", date: "2/10/24, 11.00", hubscore: 10 },
    { id: 2, name: "More about yourself", date: "2/10/24, 12.00", hubscore: 10 },
    { id: 3, name: "Are you ready for this survey?", date: "2/10/24, 1.00", hubscore: 10 },
    { id: 4, name: "Daily Reward 2", date: "3/10/24, 12.00", hubscore: 10 },
    { id: 5, name: "Are you ready for this survey?", date: "3/10/24, 1.00", hubscore: 10 },
    { id: 6, name: "Are you ready for this survey?", date: "4/10/24, 11.00", hubscore: 10 },
  ]);

  // State for validation and error messages
  const [errors, setErrors] = useState({});
  const [formInput, setFormInput] = useState({
    name: "",
    date: "",
    hubscore: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error message on input change
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formInput.name) newErrors.name = "Name is required.";
    if (!formInput.date) newErrors.date = "Date is required.";
    if (!formInput.hubscore) newErrors.hubscore = "Hubscore is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Proceed to the next step or perform the desired action
      // alert("Form submitted successfully!");
    }
  };

  return (
    <div className="min-h-screen poppins flex flex-col items-center">
      <div className="w-[80%] max-w-sm md:w-[300px] md:h-[240px] shadow-md bg-white rounded-lg p-2 text-center mb-4">
        <h2 className="text-[#0057A1] font-bold text-lg mb-2">Coins Earned</h2>
        <div className="flex justify-center">
          <div className="bg-blue-100 flex flex-col font-semibold w-28 h-28 rounded-full items-center justify-center text-[26px] md:text-3xl">
            {coins}
            <p className="font-bold -mt-1 text-[14px]">HUBCOINS</p>
          </div>
        </div>
        <Link href="/dashboard/payment">
          <button className="mt-4 bg-[#0057A1] text-white text-[14px] md:text-[14px] md:w-[180px] px-4 py-2 rounded-md hover:bg-[#0056a1ec] transition">
            Redeem Points
          </button>
        </Link>
      </div>

      <div className="w-full p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-2">Fill Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formInput.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formInput.date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Hubscore</label>
            <input
              type="number"
              name="hubscore"
              value={formInput.hubscore}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            {errors.hubscore && (
              <p className="text-red-500 text-sm">{errors.hubscore}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#0057A1] text-white px-4 py-2 rounded hover:bg-[#004785]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Rewards;
