"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Reviews = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [autoplayDelay, setAutoplayDelay] = useState(3000);

  // Fetch testimonials on mount.
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch(`${API_BASE_URL}/testimonial/random/5`, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    }
    fetchTestimonials();
  }, []);

  // Update autoplay delay based on screen width.
  useEffect(() => {
    function updateDelay() {
      const width = window.innerWidth;
      if (width < 768) {
        setAutoplayDelay(3000);
      } else if (width < 1024) {
        setAutoplayDelay(4000);
      } else {
        setAutoplayDelay(5000);
      }
    }
    updateDelay();
    window.addEventListener("resize", updateDelay);
    return () => window.removeEventListener("resize", updateDelay);
  }, []);

  // Custom autoplay using the "slideChangeTransitionEnd" event.
  useEffect(() => {
    if (!swiperInstance) return;
    let timeoutId = null;

    const scheduleNextSlide = () => {
      timeoutId = setTimeout(() => {
        swiperInstance.slideNext();
      }, autoplayDelay);
    };

    // When slide transition ends, clear the timeout and schedule the next slide.
    const onSlideChangeTransitionEnd = () => {
      clearTimeout(timeoutId);
      scheduleNextSlide();
    };

    swiperInstance.on("slideChangeTransitionEnd", onSlideChangeTransitionEnd);

    // Start the initial autoplay after the delay.
    scheduleNextSlide();

    return () => {
      clearTimeout(timeoutId);
      if (swiperInstance && swiperInstance.off) {
        swiperInstance.off("slideChangeTransitionEnd", onSlideChangeTransitionEnd);
      }
    };
  }, [swiperInstance, autoplayDelay]);

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <h2 className="text-2xl font-bold md:text-[#0057A1] md:text-3xl text-center mb-8">
        Our Happy Panelists Say About Us
      </h2>

      <div className="relative flex items-center justify-center py-4 md:py-12 md:px-12">
        {/* Left Arrow */}
        <button
          onClick={() => swiperInstance && swiperInstance.slidePrev()}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 z-20 hover:bg-gray-200"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Background Accent */}
        <div className="bg-orange-300 w-[60%] h-full rounded-md absolute z-0 py-12"></div>

        {/* Swiper */}
        <div className="z-10 w-full px-6 md:px-0">
          <Swiper
            onSwiper={setSwiperInstance}
            loop={true}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-gray-50 md:max-w-[450px] shadow-2xl rounded-lg p-6 mx-auto">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 text-xl">
                      {"★".repeat(testimonial.rating).padEnd(5, "☆")}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">{testimonial.comment}</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full mr-4 border border-gray-200"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-500 text-sm">{testimonial.city}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => swiperInstance && swiperInstance.slideNext()}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 z-20 hover:bg-gray-200"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="h-16 md:h-32"></div>
    </div>
  );
};

export default Reviews;
