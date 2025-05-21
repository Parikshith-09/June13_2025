import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import cakeAnimation from './assets/lottie/Cake_lottie.json';
import boxAnimation from './assets/lottie/GiftBox_lottie.json';
import celebrationAnimation from './assets/lottie/Celebration_lottie.json';
import candleAnimation from './assets/lottie/Candle_lottie.json';
import './BirthdayAnimation.css';

const BirthdayAnimation = () => {
  const [currentAnimation, setCurrentAnimation] = useState('cake');
  const [showMessage, setShowMessage] = useState(false);
  const [showCandle, setShowCandle] = useState(false);
  const [showBlowButton, setShowBlowButton] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showBoxAndCelebration, setShowBoxAndCelebration] = useState(false);

  useEffect(() => {
    if (currentAnimation === 'cake') {
      // Show cake first
      setShowCandle(false);
      setCandlesBlown(false);
      setIsFadingOut(false);
      setShowBoxAndCelebration(false);
      
      // Add candles after a delay
      const candleTimer = setTimeout(() => {
        setShowCandle(true);
        // Show blow button after candles appear
        setShowBlowButton(true);
      }, 1000); // 1 second delay

      return () => clearTimeout(candleTimer);
    } else {
      setShowCandle(false);
      setShowBlowButton(false);
    }
  }, [currentAnimation]);

  const handleBlowCandles = () => {
    setIsFadingOut(true);
    setShowBlowButton(false);
    
    // Wait for fade out animation to complete
    setTimeout(() => {
      setCandlesBlown(true);
      setShowBoxAndCelebration(true);
      setShowMessage(true);
    }, 1500); // Wait for fade out animation to complete
  };

  return (
    <div className="birthday-container">
      <div className="animation-wrapper">
        {!showBoxAndCelebration ? (
          <Lottie
            animationData={cakeAnimation}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <>
            <div className="box-animation">
              <div className="box-row">
                <Lottie
                  animationData={boxAnimation}
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
                <Lottie
                  animationData={boxAnimation}
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className="box-row">
                <Lottie
                  animationData={boxAnimation}
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
            <div className="celebration-animation">
              <Lottie
                animationData={celebrationAnimation}
                loop={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </>
        )}
        {showCandle && !candlesBlown && (
          <div className={`candle-wrapper ${isFadingOut ? 'fade-out' : ''}`}>
            <Lottie
              animationData={candleAnimation}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </div>
      {showBlowButton && (
        <button 
          className="blow-button"
          onClick={handleBlowCandles}
        >
          Blow the Candles! 🎂
        </button>
      )}
      {showMessage && (
        <div className="birthday-message">
          <h1>Happy Birthday!</h1>
          <p>Wishing you a day filled with happiness and joy!</p>
        </div>
      )}
    </div>
  );
};

export default BirthdayAnimation; 