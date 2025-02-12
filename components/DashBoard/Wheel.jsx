import React from "react";
import WheelComponent from "./WheelComponent";

const Wheel = () => {
  const segments = [
    "Prize 1",
    "Prize 2",
    "Prize 3",
    "Prize 4",
    "Prize 5",
    "Prize 6",
    "Prize 7",
    "Prize 8",
  ];
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#FF9000",
    "#007939",
    "#FFDD00",
    "#FF0000",
  ];

  const handleFinished = (winner) => {
    // alert(`Congratulations! You won: ${winner}`);
    console.log('running spin')
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <WheelComponent
        segments={segments}
        segColors={segColors}
        onFinished={handleFinished}
        size={300}
        buttonText="Spin"
      />
    </div>
  );
};

export default Wheel;
