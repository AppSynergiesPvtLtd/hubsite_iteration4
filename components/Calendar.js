"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const Calendar = ({ selectedDate, onDateSelect, onSave, onCancel }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Generate year range from 1970 to the current year
  const currentYear = new Date().getFullYear();
  const startYear = 1970;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex));
    setShowMonthDropdown(false);
  };

  const handleYearSelect = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth()));
    setShowYearDropdown(false);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setLocalSelectedDate(newDate);
    onDateSelect?.(newDate);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400">
          {new Date(currentDate.getFullYear(), currentDate.getMonth(), -firstDay + i + 1).getDate()}
        </div>
      );
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        localSelectedDate &&
        localSelectedDate.getDate() === day &&
        localSelectedDate.getMonth() === currentDate.getMonth() &&
        localSelectedDate.getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`w-10 h-10 flex items-center justify-center cursor-pointer 
            ${isSelected ? "bg-[#0057A1] text-white rounded-full" : "text-[#0057A1] hover:bg-blue-50 rounded-full"}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-[300px] bg-white rounded border border-[#0057A1] p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              className="text-[#0057A1] font-medium hover:bg-blue-50 px-3 py-1 rounded flex items-center gap-1"
            >
              {months[currentDate.getMonth()]}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showMonthDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-[#0057A1]"
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="text-[#0057A1] font-medium hover:bg-blue-50 px-3 py-1 rounded flex items-center gap-1"
            >
              {currentDate.getFullYear()}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showYearDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-[#0057A1]"
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="text-[#0057A1] hover:bg-blue-50 p-2 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleNextMonth} className="text-[#0057A1] hover:bg-blue-50 p-2 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={index} className="w-10 h-10 flex items-center justify-center text-gray-400 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">{renderCalendarDays()}</div>

      <div className="flex justify-between gap-4">
        <button
          onClick={onCancel}
          className="flex-1 py-2 px-4 border border-[#0057A1] text-[#0057A1] rounded hover:bg-blue-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave?.(localSelectedDate)}
          disabled={!localSelectedDate}
          className={`flex-1 py-2 px-4 rounded ${
            localSelectedDate
              ? "bg-[#0057A1] text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Calendar;
