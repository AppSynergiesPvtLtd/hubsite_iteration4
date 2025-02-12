const stepsConfig = [
    // Existing Steps
    {
      step: 1,
      title: "Date of Birth",
      description: "This is so we can match you to surveys relevant to your age.",
      type: "input",
      fields: [
        { name: "day", placeholder: "Day (DD)" },
        { name: "month", placeholder: "Month (MM)" },
        { name: "year", placeholder: "Year (YYYY)" },
      ],
    },
    {
      step: 2,
      title: "Gender",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: ["Male", "Female", "Another Gender"],
    },
    {
      step: 3,
      title: "Address",
      description:
        "Postal address is used to match you with surveys that are relevant to your location.",
      type: "input",
      fields: [
        { name: "address", placeholder: "Address" },
        { name: "landmark", placeholder: "Landmark" },
        { name: "city", placeholder: "City" },
        { name: "state", placeholder: "State" },
        { name: "pincode", placeholder: "Pincode" },
      ],
    },
    {
      step: 4,
      title: "What country do you currently reside in?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: ["India", "Australia", "America", "UAE"],
    },
    {
      step: 5,
      title: "What is your highest level of education?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: ["High School", "Bachelor's Degree", "Master's Degree", "Doctorate"],
    },
  
    // Newly Added Steps
    {
      step: 6,
      title: "What is your current employment status?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: [
        "Employed Full-time",
        "Employed Part-time",
        "Unemployed",
        "Student",
        "Retired",
        "Homemaker",
      ],
    },
    {
      step: 7,
      title: "What industry do you work in or have experience in?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: [
        "Healthcare",
        "Education",
        "Technology",
        "Finance",
        "Retail",
        "Other",
      ],
    },
    {
      step: 8,
      title: "What are your interests or hobbies?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: [
        "Sports",
        "Technology",
        "Travel",
        "Cooking",
        "Reading",
        "Other",
      ],
    },
    {
      step: 9,
      title: "How often do you participate in online surveys?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: ["Never", "Occasionally", "Regularly"],
    },
    {
      step: 10,
      title: "What types of products or services are you most interested in providing feedback on?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: [
        "Food & Beverage",
        "Technology",
        "Travel",
        "Fashion",
        "Home Goods",
        "Other",
      ],
    },
    {
      step: 11,
      title: "What motivates you to participate in surveys?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: ["Rewards", "Interest in the topics", "Helping businesses", "Other"],
    },
    {
      step: 12,
      title: "Are you open to participating in product testing or focus groups?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: ["Yes", "No", "Maybe"],
    },
    {
      step: 13,
      title: "How did you hear about Hubsite Social?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: ["Social Media", "Friends", "Online Search", "Advertisement"],
    },
    {
      step: 14,
      title: "Do you have any specific feedback or suggestions for us to improve your experience?",
      description: "",
      type: "textarea",
      fields: [{ name: "feedback", placeholder: "Write something here..." }],
    },
    {
      step: 15,
      title: "Would you like to subscribe to our newsletter for updates and opportunities?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: ["Yes", "No"],
    },
    {
      step: 16,
      title: "What is your household income range?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: [
        "Under $25,000",
        "$25,000-$50,000",
        "$51,000-$75,000",
        "$76,000-$100,000",
        "Over $100,000",
      ],
    },
    {
      step: 17,
      title: "Do you have children? If so, what are their ages?",
      description: "Select the one you most closely identify with.",
      type: "options",
      options: ["Yes", "No"],
    },
    {
        step: 18,
        title: "What social media platforms do you actively use?",
        description: "Select the one you most closely identify with.",
        type: "options",
        options: ["Facebook", "Instagram", "Twitter", "LinkedIn", "Other"],
      },
      {
        step: 19,
        title: "How often do you shop online?",
        description: "Select the one you most closely identify with.",
        type: "options",
        options: ["Rarely", "Monthly", "Weekly", "Daily"],
      },
      {
        step: 20,
        title: "What is your preferred method of receiving rewards?",
        description: "Select the one you most closely identify with.",
        type: "options",
        options: ["Gift Cards", "Cash", "Discounts", "Donations to Charity"],
      }
      
  ];
  
  export default stepsConfig;
  