"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminRoutes from "@/pages/adminRoutes";
import { CheckCircle, AlertCircle } from "lucide-react"; // Import icons

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const MessageModal = ({ visible, type, message, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-sm w-full mx-4">
        <div className="flex justify-center mb-4">
          {type === "success" ? (
            <CheckCircle className="w-12 h-12 text-green-500" />
          ) : (
            <AlertCircle className="w-12 h-12 text-red-500" />
          )}
        </div>
        <div className="text-center mb-4">
          <p className="text-lg">{message}</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const TestimonialForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const initialFormData = {
    name: "",
    city: "",
    comment: "",
    rating: "",
    file: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");


  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: "",
    message: "",
    redirect: null,
  });

  useEffect(() => {
    if (!router.isReady) return;
    if (id) {
      setIsFetching(true);
      (async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/testimonial/${id}`, {
            method: "GET",
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch testimonial");
          }
          const data = await response.json();
          if (data && data.id) {
            setFormData({
              name: data.name || "",
              city: data.city || "",
              comment: data.comment || "",
              rating: data.rating ? data.rating.toString() : "",
              file: null, 
            });
            setImagePreview(data.image || null);
          } else {
            setFetchError("Testimonial not found or invalid id.");
          }
        } catch (error) {
          console.error("Error fetching testimonial:", error);
          setFetchError("Testimonial not found or invalid id.");
        } finally {
          setIsFetching(false);
        }
      })();
    }
  }, [id, router.isReady]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle file input changes.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.comment) newErrors.comment = "Comment is required";
    if (!formData.rating) newErrors.rating = "Rating is required";
    if (!id && !formData.file) newErrors.file = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const closeModal = () => {
    if (modalConfig.redirect) {
      router.push(modalConfig.redirect);
    }
    setModalConfig({
      visible: false,
      type: "",
      message: "",
      redirect: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      if (id) {
        const updateFormData = new FormData();
        updateFormData.append("id", id);
        updateFormData.append("name", formData.name);
        updateFormData.append("city", formData.city);
        updateFormData.append("comment", formData.comment);
        updateFormData.append("rating", formData.rating);
        if (formData.file) {
          updateFormData.append("file", formData.file);
        }
        const response = await fetch(`${API_BASE_URL}/testimonial/update`, {
          method: "PUT",
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: updateFormData,
        });
        const result = await response.json();
        if (response.ok) {
          setModalConfig({
            visible: true,
            type: "success",
            message: "Testimonial updated successfully!",
            redirect: { pathname: router.pathname, query: { id } },
          });
        } else {
          throw new Error(result.message || "Something went wrong");
        }
      } else {
        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("city", formData.city);
        submitData.append("comment", formData.comment);
        submitData.append("rating", formData.rating);
        if (formData.file) {
          submitData.append("file", formData.file);
        }
        const response = await fetch(`${API_BASE_URL}/testimonial/create`, {
          method: "POST",
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: submitData,
        });
        const result = await response.json();
        if (response.ok) {
          setModalConfig({
            visible: true,
            type: "success",
            message: "Testimonial created successfully!",
            redirect: { pathname: router.pathname, query: { id: result.data.id } },
          });
          setFormData(initialFormData);
          setImagePreview(null);
        } else {
          throw new Error(result.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setModalConfig({
        visible: true,
        type: "error",
        message: error.message || "Something went wrong",
        redirect: null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen w-full bg-white p-6">
        <p>Loading testimonial data...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen w-full bg-white p-6">
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          {fetchError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white p-6">
      <MessageModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        message={modalConfig.message}
        onClose={closeModal}
      />
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div>
          <label className="block mb-2">Upload Image here*</label>
          {imagePreview && (
            <div className="mb-2">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
          <button
            type="button"
            onClick={() => document.getElementById("file-upload").click()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Image
          </button>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">City*</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter City"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Comment*</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            className="w-full p-2 border rounded h-32 resize-none"
            placeholder="Enter Comment"
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Rating*</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            min="1"
            max="5"
            className="w-full p-2 border rounded"
            placeholder="Enter Rating"
          />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : id ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminRoutes(TestimonialForm);
