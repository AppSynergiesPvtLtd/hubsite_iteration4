export const CircularProgress = ({ percentage }) => {
    // Base values
    const radius = 30; // Base radius
    const strokeWidth = 5; // Stroke width for both circles
    // Adjust radius so the stroke doesn't get clipped
    const adjustedRadius = radius - strokeWidth / 2;
    // Compute the circumference based on the adjusted radius
    const circumference = 2 * Math.PI * adjustedRadius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
    return (
      <div className="relative w-12 h-12 md:w-16 md:h-16">
        {/* Set the viewBox to match the full circle area */}
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        >
          {/* Background Circle */}
          <circle
            cx={radius}
            cy={radius}
            r={adjustedRadius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx={radius}
            cy={radius}
            r={adjustedRadius}
            stroke="#0057A1"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs md:text-base lg:text-lg xl:text-xl font-semibold text-[#0057A1]">
          {percentage}%
        </span>
      </div>
    );
  };
  