import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { onBoarding, setUser } from "@/store/userSlice"; // Import Redux actions
import GetStarted from "./GetStarted";
import Questions from "./Questions";
import axios from "axios";
import Spinner from "../Spinner";

const API_BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const OnBoarding = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // Access user state
  const [currentStage, setCurrentStage] = useState("getStarted"); // Default stage
  const [loading,setLoading] = useState(true)
  console.log("onboarding",user)
  useEffect(()=>{
    if(user.isOnboardingDone){
      router.push("/dashboard")
    }
    else{
      setLoading(false)
    }
  })
  // Sync state with query parameter
  useEffect(() => {
    const stage = router.query.stage || "getStarted";
    setCurrentStage(stage);
  }, [router.query.stage]);

  const handleCompleteGetStarted = () => {
    router.push("/onboarding?stage=questions", undefined, { shallow: true });
  };

  const handleCompleteQuestions = () => {
  
    if (user) {
      const updatedUser = { ...user, boarding: true }; // Ensure boarding is set to true
      console.log("Updating user onboarding state:", updatedUser);
      localStorage.setItem("onBoarding", JSON.stringify(true));
      const changeStatus = async()=>{
       const resp= await axios.post(`${API_BASE_URL}/response/complete-onboarding`,{},{
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        });
      }
      changeStatus();
    } else {
      console.error("User data is not available. Ensure user is logged in.");
    }
  };
  

  const renderContent = () => {
    if (currentStage === "getStarted") {
      return <GetStarted onComplete={handleCompleteGetStarted} />;
    } else if (currentStage === "questions") {
      return <Questions onComplete={handleCompleteQuestions} />;
    }
    return null;
  };

  return (
    <>{loading?(<Spinner/>):( <div className="flex justify-center items-center">
      {renderContent()}
    </div>)}</>
   
  );
};

export default OnBoarding;
