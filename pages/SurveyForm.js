import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";
import React, { useState } from "react";

const SurveyForm = () => {
  const questions = [
    {
      question: "What country do you currently reside in?",
      options: ["High School", "Bachelor's Degree", "Master's Degree", "Doctorate"],
      allowMultiple: false,
    },
    {
      question: "Which hobbies do you enjoy?",
      options: ["Reading", "Traveling", "Cooking", "Gaming"],
      allowMultiple: true,
    },
    {
      question: "Which devices do you use daily?",
      options: ["Laptop", "Mobile Phone", "Tablet", "Desktop"],
      allowMultiple: true,
    },
    {
      question: "What is your preferred travel mode?",
      options: ["Car", "Bike", "Public Transport", "Walk"],
      allowMultiple: false,
    },
    {
      question: "Which seasons do you like the most?",
      options: ["Spring", "Summer", "Autumn", "Winter"],
      allowMultiple: true,
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill([]));

  const handleOptionSelect = (option) => {
    const updatedAnswers = [...answers];
    const allowMultiple = questions[currentQuestion].allowMultiple;

    if (allowMultiple) {
      if (updatedAnswers[currentQuestion].includes(option)) {
        updatedAnswers[currentQuestion] = updatedAnswers[currentQuestion].filter(
          (item) => item !== option
        );
      } else {
        updatedAnswers[currentQuestion].push(option);
      }
    } else {
      updatedAnswers[currentQuestion] = [option];
    }
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-5xl md:h-[400px]  mx-auto p-6">
      <div className="w-full bg-gray-200 rounded-full mb-6">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="text-blue-600 text-lg font-semibold mb-2">
        Question {currentQuestion + 1} / {questions.length}
      </div>

      <h2 className="text-2xl font-bold mb-4">{questions[currentQuestion].question}</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`w-full border rounded-lg py-3 px-4 text-center transition-colors  duration-200
              ${
                answers[currentQuestion].includes(option)
                  ? "bg-[#0057A1] text-white border-[#0057A1]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded ${
            currentQuestion === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#0057A1] text-white hover:bg-[#0056a1f2]"
          }`}
        >
          ← Previous
        </button>
        {/* <Link href={/}></Link> */}
        <button
          onClick={handleNext}
          disabled={answers[currentQuestion].length === 0}
          className={`px-4 py-2 rounded text-white ${
            answers[currentQuestion].length === 0
              ? "bg-[#0057A1] cursor-not-allowed"
              : "bg-[#0057A1] text-white hover:bg-[#0056a1f2]"
          }`}
        >
          {currentQuestion === questions.length - 1 ? "Submit" : "Next →"}
        </button>
      </div>
    </div>
  );
};
// SurveyForm.Layout = MainLayout; 
export default SurveyForm;
