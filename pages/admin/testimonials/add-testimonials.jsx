"use client"

import { useState } from "react"
import AdminRoutes from "@/pages/adminRoutes"

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const TestimonialForm = () => {
  const initialFormData = {
    name: "",
    city: "",
    comment: "",
    rating: "",
    file: null,
  }

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  function validateForm() {
    const newErrors = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.comment) newErrors.comment = "Comment is required"
    if (!formData.rating) newErrors.rating = "Rating is required"
    if (!formData.file) newErrors.file = "Image is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    const submitData = new FormData()
    submitData.append("name", formData.name)
    submitData.append("city", formData.city)
    submitData.append("comment", formData.comment)
    submitData.append("rating", formData.rating)
    if (formData.file) {
      submitData.append("file", formData.file)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/testimonial/create`, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: submitData,
      })

      const result = await response.json()

      if (response.ok) {
        // Show success message
        setSuccessMessage("Testimonial created successfully!")
        // Reset form data
        setFormData(initialFormData)
        setImagePreview(null)
        // Optionally clear success message after a few seconds
        setTimeout(() => setSuccessMessage(""), 5000)
      } else {
        throw new Error(result.message || "Something went wrong")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white p-6">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}
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
          {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
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
          {errors.name && <p className="text-red-500 text-sm mt-1">Name is required</p>}
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
          {errors.city && <p className="text-red-500 text-sm mt-1">City is required</p>}
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
          {errors.comment && <p className="text-red-500 text-sm mt-1">Comment is required</p>}
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
          {errors.rating && <p className="text-red-500 text-sm mt-1">Rating is required</p>}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminRoutes(TestimonialForm)
