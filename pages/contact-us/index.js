import MainLayout from '@/layouts/MainLayout';
import Image from 'next/image';
import React, { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, email, message } = formData;

    if (!name) newErrors.name = 'Name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    if (!message) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);

      const response = await fetch(`${API_BASE_URL}/contact-us/create`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          "x-api-key": API_KEY,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        if (responseData.errors) {
          const apiErrors = {};
          responseData.errors.forEach(error => {
            apiErrors[error.field] = error.message;
          });
          setErrors(apiErrors);
        } else {
          setErrors({ form: 'Failed to submit the form. Please try again.' });
        }
      }
    } catch (err) {
      setErrors({ form: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center md:min-h-[650px] poppins p-3 overflow-x-hidden">
      <h1 className="text-xl md:w-[320px] font-medium text-[#333333] text-center mb-6 poppins-bold ">
        Love to hear from you,<br/> Get in touch 👋
      </h1>
      {formSubmitted ? (
        <div className="flex flex-col items-center justify-center mt-8">
          <div className="w-[250px] h-[250px] md:w-[500.6px] md:h-[450px] relative">
            <Image
              src="/contact-fianl.png"
              alt="Contact Illustration"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <p className="md:text-2xl md:w-[630px] text-center font-medium mt-4">
            Thank you for reaching out! We have received your message and will be in touch with you shortly.
          </p>
        </div>
      ) : (
        <div className="flex flex-col-reverse md:flex-row items-center justify-center w-full space-y-6 md:space-y-0 md:space-x-12">
          <div className="w-full max-w-lg">
            <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  placeholder="Enter name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`mt-1 w-full border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 ${errors.message ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                  placeholder="Enter message"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-fit mt-4 bg-[#0057A1] text-white font-medium py-2 px-2 md:py-2 md:px-8 rounded-lg hover:bg-[#0056a1e9] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="w-[345px] h-[229px] md:w-[596.6px] md:h-[387px] relative">
            <Image
              src="/contact.png"
              alt="Description of the image"
              layout="fill"
              objectFit="cover"
              className="shadow-black"
            />
          </div>
        </div>
      )}
    </div>
  );
};

ContactForm.Layout = MainLayout;

export default ContactForm;
