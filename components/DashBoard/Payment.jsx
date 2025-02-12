import Image from 'next/image';
import React, { useState } from "react";

const PaymentComp = () => {
  const [selectedMethod, setSelectedMethod] = useState("bank");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    upiId: "",
    amount: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    contactNumber: "",
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    upiId: "",
    amount: "",
  });

  const availableBalance = 600;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateStep1 = () => {
    let isValid = true;
    let newErrors = { ...errors };

    if (selectedMethod === "bank") {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required.";
        isValid = false;
      } else {
        newErrors.fullName = "";
      }

      if (!formData.contactNumber) {
        newErrors.contactNumber = "Contact number is required.";
        isValid = false;
      } else {
        newErrors.contactNumber = "";
      }

      if (!formData.bankName) {
        newErrors.bankName = "Bank name is required.";
        isValid = false;
      } else {
        newErrors.bankName = "";
      }

      if (!formData.accountNumber) {
        newErrors.accountNumber = "Account number is required.";
        isValid = false;
      } else {
        newErrors.accountNumber = "";
      }

      if (formData.accountNumber !== formData.confirmAccountNumber) {
        newErrors.confirmAccountNumber = "Account numbers must match.";
        isValid = false;
      } else {
        newErrors.confirmAccountNumber = "";
      }

      if (!formData.ifscCode) {
        newErrors.ifscCode = "IFSC code is required.";
        isValid = false;
      } else {
        newErrors.ifscCode = "";
      }
    } else {
      if (!formData.upiId) {
        newErrors.upiId = "UPI ID is required.";
        isValid = false;
      } else {
        newErrors.upiId = "";
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    let isValid = true;
    let newErrors = { ...errors };

    const amount = parseFloat(formData.amount);

    if (!formData.amount) {
      newErrors.amount = "Amount is required.";
      isValid = false;
    } else if (isNaN(amount) || amount < 100) {
      newErrors.amount = "Minimum amount to redeem is 100 HUBCOINS.";
      isValid = false;
    } else if (amount > availableBalance) {
      newErrors.amount = `Insufficient balance. You only have ${availableBalance} HUBCOINS.`;
      isValid = false;
    } else {
      newErrors.amount = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (step === 1) {
      if (!validateStep1()) {
        return; // Don't proceed to the next step if validation fails
      }
    }

    if (step === 2) {
      if (!validateStep2()) {
        return; // Don't proceed to the next step if validation fails
      }
    }

    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => setStep((prevStep) => prevStep - 1);

  return (
    <div className="md:w-[85%] mx-auto p-6 mt-10 rounded-lg poppins">
      {step === 1 && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setSelectedMethod("bank")}
            className={`px-4 py-2 ${
              selectedMethod === "bank" ? "bg-[#0057A1] text-white" : "bg-gray-200"
            } rounded-l`}
          >
            🏦 Bank
          </button>
          <button
            onClick={() => setSelectedMethod("upi")}
            className={`px-4 py-2 ${
              selectedMethod === "upi" ? "bg-[#0057A1] text-white" : "bg-gray-200"
            } rounded-r`}
          >
            💳 UPI
          </button>
        </div>
      )}

      <div className="min-h-[320px] flex flex-col justify-between">
        {selectedMethod === "bank" && step === 1 && (
          <div>
            {[
              { name: "fullName", placeholder: "Full Name" },
              { name: "contactNumber", placeholder: "Your Contact Number" },
              { name: "bankName", placeholder: "Bank Name" },
              { name: "accountNumber", placeholder: "Account Number" },
              { name: "confirmAccountNumber", placeholder: "Confirm Account Number" },
              { name: "ifscCode", placeholder: "IFSC Code" },
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <input
                  name={field.name}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
                {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
              </div>
            ))}
          </div>
        )}

        {selectedMethod === "upi" && step === 1 && (
          <div>
            <div className="mb-4">
              <input
                name="upiId"
                placeholder="Your UPI ID"
                onChange={handleChange}
                className="border p-2 w-full"
              />
              {errors.upiId && <p className="text-red-500 text-sm">{errors.upiId}</p>}
            </div>

            <div className="flex space-x-2 mb-4">
              {["@paytm", "@apl", "@upi", "@ybl"].map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setFormData((prevState) => ({
                      ...prevState,
                      upiId: prevState.upiId + tag,
                    }))
                  }
                  className="bg-blue-200 px-3 py-1 rounded"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-4">
              <strong>Available Balance:</strong> {availableBalance} HUBCOINS
            </p>
            <div className="mb-4">
              <input
                name="amount"
                placeholder="Enter Amount"
                onChange={handleChange}
                className="border p-2 w-full"
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
            </div>
            <p className="text-gray-500 mb-4">Minimum 100 HUBCOINS</p>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mb-4">
              <Image
                src="/finalpayment.png"
                alt="Money transfer illustration"
                width={500}
                height={500}
                className="mx-auto"
              />
              <p className="text-lg font-medium mt-2 text-center w-72 m-auto">
                Your money will reflect in your account soon
              </p>
            </div>
          </div>
        )}

        <div className="w-[300px] flex justify-center items-center m-auto">
          {step < 3 && (
            <button
              onClick={nextStep}
              className="bg-[#0057A1] hover:bg-[#0056a1f2] text-white w-[200px] py-2 rounded mt-4"
            >
              {step === 2 ? "Redeem" : "Next"}
            </button>
          )}
          {step === 3 && (
            <button
              onClick={() => setStep(1)}
              className="bg-[#0057A1] hover:bg-[#0056a1f2] text-white px-4 w-[200px] py-2 rounded mt-4"
            >
              Okay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentComp;
