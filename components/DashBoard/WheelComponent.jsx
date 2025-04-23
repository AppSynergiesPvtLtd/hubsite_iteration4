import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from 'next-i18next'

const WheelComponent = ({
  segments,
  segColors,
  onFinished,
  size = 400,
  buttonText,
  isOnlyOnce = true,
}) => {
  const { t } = useTranslation('dashboard')
  const defaultButtonText = buttonText || t('spinner.buttonText')

  const [isSpinning, setSpinning] = useState(false)
  const [isFinished, setFinished] = useState(false)
  const [showReward, setShowReward] = useState(false) // Show reward state
  const [showNextRewards, setShowNextRewards] = useState(false) // Show 7-day rewards state
  const [currentReward, setCurrentReward] = useState(null) // Current reward
  const canvasRef = useRef(null)
  const [angle, setAngle] = useState(0) // Current angle of the wheel

  useEffect(() => {
    drawWheel()
  }, [segments])

  const spin = () => {
    if (isSpinning || (isFinished && isOnlyOnce)) return

    setSpinning(true)

    const randomEndAngle = Math.random() * 360 // Random ending position
    const totalRotations = 5 // Total full rotations
    const finalAngle = totalRotations * 360 + randomEndAngle // Final angle
    const decelerationFrames = 180 // Total frames to decelerate

    let currentSpeed = 20 // Initial speed (degrees/frame)
    let currentAngle = angle // Start angle
    let frames = 0

    const spinInterval = setInterval(() => {
      frames += 1

      // Decrease speed linearly
      if (frames <= decelerationFrames) {
        currentSpeed = Math.max(0, currentSpeed - 20 / decelerationFrames)
      }

      currentAngle += currentSpeed
      setAngle(currentAngle)

      // Stop the wheel if it reaches the final angle
      if (frames > decelerationFrames) {
        clearInterval(spinInterval)
        setSpinning(false)
        setFinished(true)

        const segmentIndex = Math.floor(
          segments.length -
            (((currentAngle % 360) / (360 / segments.length)) % segments.length)
        )
        const winner = segments[segmentIndex]
        setCurrentReward(winner) // Set the reward
        setTimeout(() => {
          setShowReward(true) // Show reward state
        }, 1000)

        if (onFinished) onFinished(winner)
      }
    }, 16) // Run at ~60 FPS
  }

  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const arc = (2 * Math.PI) / segments.length

    ctx.clearRect(0, 0, size, size)

    // Draw the golden border with white dots
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI)
    ctx.fillStyle = '#FFD700' // Gold color
    ctx.fill()

    const dotCount = 36 // Number of dots on the border
    for (let i = 0; i < dotCount; i++) {
      const angle = (i * 2 * Math.PI) / dotCount
      const x = size / 2 + Math.cos(angle) * (size / 2 - 10)
      const y = size / 2 + Math.sin(angle) * (size / 2 - 10)
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fillStyle = 'white'
      ctx.fill()
    }

    // Draw each segment
    segments.forEach((segment, index) => {
      const startAngle = index * arc
      ctx.beginPath()
      ctx.moveTo(size / 2, size / 2)
      ctx.arc(
        size / 2,
        size / 2,
        size / 2 - 20,
        startAngle,
        startAngle + arc,
        false
      )
      ctx.closePath()
      ctx.fillStyle = segColors[index]
      ctx.fill()

      // Draw segment text
      ctx.save()
      ctx.translate(size / 2, size / 2)
      ctx.rotate(startAngle + arc / 2)
      ctx.textAlign = 'center'
      ctx.fillStyle = 'white'
      ctx.font = 'bold 12px Arial'
      ctx.fillText(segment, size / 3, 0)

      // Draw coin icon
      ctx.font = 'bold 14px Arial'
      ctx.fillText('💰', size / 3, 20)
      ctx.restore()
    })

    // Draw the gold center circle
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 6, 0, 2 * Math.PI)
    ctx.fillStyle = '#FFD700' // Gold
    ctx.fill()

    // Draw the white inner circle
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 8, 0, 2 * Math.PI)
    ctx.fillStyle = 'white' // White
    ctx.fill()

    // Draw the center text
    ctx.fillStyle = 'black'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(defaultButtonText, size / 2, size / 2 + 5)
  }

  const handleClaimReward = () => {
    setShowReward(false)
    setTimeout(() => {
      setShowNextRewards(true) // Show next rewards state
    }, 1000)
  }

  const resetState = () => {
    setShowNextRewards(false)
    setFinished(false)
    setAngle(0)
  }

  return (
    <div
      className='bg-green-500 min-h-[500px] min-w-[650px] p-2'
      style={{ textAlign: 'center', position: 'relative' }}
    >
      {!showReward && !showNextRewards && (
        <div>
          <div className='text-[#0057A1] '>
            <h1 className='text-3xl mb-4'>{t('spinner.heading')}</h1>
            <p className='md:text-xl mt-2 md:w-[640px]'>
              {t('spinner.description')}
            </p>
          </div>
          <div
            style={{
              position: 'relative',
              width: size,
              height: size,
              margin: 'auto',
            }}
          >
            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              style={{
                transform: `rotate(${angle}deg)`,
                transition: isSpinning ? 'none' : 'transform 0s',
              }}
            ></canvas>
            <div
              style={{
                position: 'absolute',
                top: size / 2 - 70,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '30px',
                height: '40px',
                backgroundColor: 'white',
                clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                zIndex: 1,
              }}
            ></div>
          </div>
          <button
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              cursor:
                isSpinning || (isFinished && isOnlyOnce)
                  ? 'not-allowed'
                  : 'pointer',
            }}
            onClick={spin}
            disabled={isSpinning || (isFinished && isOnlyOnce)}
          >
            {t('spinner.spinButton')}
          </button>
        </div>
      )}

      {/* Reward State */}
      {showReward && (
        <div>
          <h2 className='text-3xl'>{t('spinner.reward.title')}</h2>
          <div className='reward-display'>
            <p className='text-xl'>
              {currentReward} {t('spinner.reward.hubscoreLabel')}
            </p>
            <div className='bg-white w-[280px] h-[280px] flex justify-center flex-col align-middle m-auto rounded-full'>
              <img src='/20coin' alt='' />
              <p className='text-3xl text-[#0057A1'>20</p>
              <p className='text-3xl text-[#0057A1'>
                {t('spinner.reward.hubcore')}
              </p>
            </div>
            <button
              className='p-3 md:w-[300px] bg-[#0057A1] rounded-lg text-white text-xl'
              onClick={handleClaimReward}
            >
              {t('spinner.reward.claimButton')}
            </button>
          </div>
        </div>
      )}

      {/* Next Rewards State */}
      {showNextRewards && (
        <div>
          <h2>{t('spinner.nextRewards.title')}</h2>
          <p>{t('spinner.nextRewards.description')}</p>
          <div className='days-container'>
            {[...Array(7)].map((_, index) => (
              <div key={index} className='day'>
                {t('spinner.nextRewards.day')} {index + 1}
              </div>
            ))}
          </div>
          <button onClick={resetState}>
            {t('spinner.nextRewards.confirmButton')}
          </button>
        </div>
      )}
    </div>
  )
}

export default WheelComponent