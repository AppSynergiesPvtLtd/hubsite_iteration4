"use client";
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Reviews = () => {
  const [testimonials, setTestimonials] = useState([]);
  const swiperRef = useRef(null);
  const autoplayTimerRef = useRef(null);
  const [autoplayDelay, setAutoplayDelay] = useState(3000);
  const [windowWidth, setWindowWidth] = useState(1024);

  // Update windowWidth on mount and on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch testimonials on mount
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
        console.log("data", data);
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    }
    fetchTestimonials();
  }, []);

  // Update autoplay delay based on screen width
  useEffect(() => {
    const updateDelay = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setAutoplayDelay(3000);
      } else if (width < 1024) {
        setAutoplayDelay(4000);
      } else {
        setAutoplayDelay(5000);
      }
    };
    updateDelay();
    window.addEventListener("resize", updateDelay);
    return () => window.removeEventListener("resize", updateDelay);
  }, []);

  // Autoplay helper functions
  const clearAutoplayTimer = () => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }
  };

  const scheduleNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      autoplayTimerRef.current = setTimeout(() => {
        swiperRef.current.swiper.slideNext();
      }, autoplayDelay);
    }
  };

  useEffect(() => {
    if (!swiperRef.current || !swiperRef.current.swiper) return;
    const swiper = swiperRef.current.swiper;
    const onTransitionEnd = () => {
      clearAutoplayTimer();
      scheduleNextSlide();
    };
    swiper.on("slideChangeTransitionEnd", onTransitionEnd);
    // Start autoplay initially
    scheduleNextSlide();

    return () => {
      clearAutoplayTimer();
      swiper.off("slideChangeTransitionEnd", onTransitionEnd);
    };
  }, [autoplayDelay, testimonials]);

  // Determine if we need to combine testimonials into one slide.
  // On large screens (>=1024) and if there are less than 3 testimonials,
  // we want to render all testimonial cards in one slide.
  const isLargeScreen = windowWidth >= 1024;
  const combineTestimonials =
    isLargeScreen && testimonials.length > 0 && testimonials.length < 3;

  // Set Swiper props based on the above conditions.
  let slidesPerView, spaceBetween, centeredSlides, loop;
  if (combineTestimonials) {
    // When combining testimonials on large screens:
    slidesPerView = 1;
    spaceBetween = 16;
    centeredSlides = false;
    loop = false;
  } else {
    // Normal behavior:
    if (windowWidth >= 1024) {
      // Large screens: show 3 cards if available.
      slidesPerView = testimonials.length >= 3 ? 3 : testimonials.length;
      spaceBetween = testimonials.length >= 3 ? 32 : 16;
      centeredSlides = false;
      loop = testimonials.length > 1;
    } else if (windowWidth >= 768) {
      // Tablet screens: show 2 if available.
      slidesPerView = testimonials.length >= 2 ? 2 : testimonials.length;
      spaceBetween = testimonials.length >= 2 ? 24 : 16;
      centeredSlides = testimonials.length < 2;
      loop = testimonials.length > 1;
    } else {
      // Mobile: always one slide at a time.
      slidesPerView = 1;
      spaceBetween = 16;
      centeredSlides = true;
      loop = false;
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <h2 className="text-2xl font-bold md:text-[#0057A1] md:text-3xl text-center mb-8">
        Our Happy Panelists Say About Us
      </h2>

      <div className="relative flex items-center justify-center py-4 md:py-12 md:px-12">
        {!combineTestimonials && testimonials.length > 1 && (
          <button
            onClick={() => {
              if (swiperRef.current && swiperRef.current.swiper) {
                clearAutoplayTimer();
                swiperRef.current.swiper.slidePrev();
              }
            }}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full p-2 z-20 hover:bg-gray-200"
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
        )}

        <div className="bg-orange-300 w-[60%] h-full rounded-md absolute z-0 py-12"></div>

        <div className="z-10 w-full px-6 md:px-0">
          <Swiper
            ref={swiperRef}
            loop={loop}
            spaceBetween={spaceBetween}
            slidesPerView={slidesPerView}
            centeredSlides={centeredSlides}
          >
            {combineTestimonials ? (
              <SwiperSlide key="combined">
                <div className="flex justify-center items-center gap-8">
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-gray-50 w-[450px] flex-none shadow-2xl rounded-lg p-6"
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-500 text-xl">
                          {"★".repeat(testimonial.rating).padEnd(5, "☆")}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-4">{testimonial.comment}</p>
                      <div className="flex items-center">
                        {testimonial.image ? (
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-14 h-14 rounded-full mr-4 border border-gray-200"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full mr-4 border border-gray-200 flex items-center justify-center text-lg font-semibold">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                          <p className="text-gray-500 text-sm">{testimonial.city}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ) : (
              testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="bg-white sm:bg-gray-50 md:max-w-[450px] shadow-2xl rounded-lg p-6 mx-auto">
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 text-xl">
                        {"★".repeat(testimonial.rating).padEnd(5, "☆")}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">{testimonial.comment}</p>
                    <div className="flex items-center">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full mr-4 border border-gray-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full mr-4 border border-gray-200 flex items-center justify-center text-lg font-semibold">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                        <p className="text-gray-500 text-sm">{testimonial.city}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>

        {!combineTestimonials && testimonials.length > 1 && (
          <button
            onClick={() => {
              if (swiperRef.current && swiperRef.current.swiper) {
                clearAutoplayTimer();
                swiperRef.current.swiper.slideNext();
              }
            }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full p-2 z-20 hover:bg-gray-200"
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
        )}
      </div>

      <div className="h-16 md:h-32"></div>
    </div>
  );
};

export default Reviews;
