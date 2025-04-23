import React from "react";
import { useTranslation } from 'next-i18next'
import WheelComponent from "./WheelComponent";

const Wheel = () => {
  const { t } = useTranslation('dashboard')

  const segments = [
    t('spinner.prizes.prize1'),
    t('spinner.prizes.prize2'),
    t('spinner.prizes.prize3'),
    t('spinner.prizes.prize4'),
    t('spinner.prizes.prize5'),
    t('spinner.prizes.prize6'),
    t('spinner.prizes.prize7'),
    t('spinner.prizes.prize8'),
  ]
  
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
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <WheelComponent
        segments={segments}
        segColors={segColors}
        onFinished={handleFinished}
        size={300}
        buttonText={t('spinner.buttons.spin')}
      />
    </div>
  )
};

export default Wheel