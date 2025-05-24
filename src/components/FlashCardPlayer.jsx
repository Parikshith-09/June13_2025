import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import cardImage from "../assets/image.png";
import audio1 from "../assets/audio1.mp3";

const FlashCardContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const OpenButton = styled.button`
  background: linear-gradient(to right, #1db954, #1ed760);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-size: 1rem;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

// const CardContainer = styled(motion.div)`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: linear-gradient(to bottom right, #121212, #282828);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 1001;
// `;
const CardContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;


const Card = styled(motion.div)`
  width: 320px;
  height: 440px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  position: absolute;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  transition: transform 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    z-index: -1;
    border-radius: 22px;
    background: ${(props) =>
      props.borderGradient ||
      "linear-gradient(270deg, #1db954, #1ed760, #1db954)"};
    background-size: 600% 600%;
    animation: borderAnimation 6s ease infinite;
  }

  @keyframes borderAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  &:hover::before {
    filter: brightness(1.2);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 60%;
  object-fit: cover;
  filter: brightness(0.95);
`;
const CardContent = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-top: 1px solid #eee;
`;


const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  color: #222;
  font-weight: 600;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
`;

const ControlButton = styled.button`
  background: #1db954;
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  transition: background 0.3s;
  &:hover {
    background: #1ed760;
  }
`;

const ProgressBarWrapper = styled.div`
  flex-grow: 1;
  height: 10px;
  background: #eee;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(to right, #1db954, #1ed760);
  border-radius: 5px;
  transition: width 0.2s ease;
  width: ${(props) => props.progress}%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 25px;
  right: 25px;
  background: none;
  border: none;
  color: white;
  font-size: 2.2rem;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: rotate(90deg);
  }
`;

const SwipeHint = styled.div`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  color: #eee;
  font-size: 1rem;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: pulse 2s infinite ease-in-out;
  font-weight: 500;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const FlashCardPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(new Audio());
  const getPastelGradient = () => {
    const pastelColor = () => {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 70%, 85%)`; // light pastel
    };
    const color1 = pastelColor();
    const color2 = pastelColor();
    return `linear-gradient(270deg, ${color1}, ${color2}, ${color1})`;
  };

  const cards = [
    {
      id: 1,
      title: "Summer Vibes",
      image: cardImage,
      audio: audio1,
      gradient: getPastelGradient(),
    },
    {
      id: 2,
      title: "Chill Mix",
      image: cardImage,
      audio: audio1,
      gradient: getPastelGradient(),
    },
    {
      id: 3,
      title: "Workout Beats",
      image: cardImage,
      audio: audio1,
      gradient: getPastelGradient(),
    },
    {
      id: 4,
      title: "Workout Hits",
      image: cardImage,
      audio: audio1,
      gradient: getPastelGradient(),
    },
  ];

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage || 0);
    };
    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  const handleSwipe = (direction) => {
    if (direction === "left" && currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetAudio();
    } else if (direction === "right" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetAudio();
    }
  };

  const resetAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.src = cards[currentIndex].audio;
      audio.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleProgressBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const swipeHint =
    currentIndex < cards.length - 1 ? (
      <>👈 Swipe left</>
    ) : currentIndex > 0 ? (
      <>Swipe right 👉</>
    ) : null;

  return (
    <FlashCardContainer>
      <OpenButton onClick={() => setIsOpen(true)}>
        🎧 Open Flash Cards
      </OpenButton>

      <AnimatePresence>
        {isOpen && (
          <CardContainer
            style={{
              background: cards[currentIndex].gradient,
              backgroundSize: "400% 400%",
              animation: "gradientShift 10s ease infinite",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CloseButton
              onClick={() => {
                setIsOpen(false);
                resetAudio();
                setCurrentIndex(0);
              }}
            >
              ×
            </CloseButton>

            {cards.slice(currentIndex, currentIndex + 3).map((card, index) => {
              const isTop = index === 0;
              const zIndex = 3 - index;
              const scale = 1 - index * 0.05;
              const offsetY = index * 10;
              const offsetX = index * 20;

              return (
                <Card
                  key={card.id}
                  borderGradient={card.gradient}
                  style={{
                    zIndex,
                    transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
                  }}
                  drag={isTop ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (isTop && Math.abs(info.offset.x) > 100) {
                      handleSwipe(info.offset.x > 0 ? "right" : "left");
                    }
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <CardImage src={card.image} alt={card.title} />
                  <CardContent>
                    <CardTitle>{card.title}</CardTitle>
                    <PlayerControls>
                      <ControlButton onClick={togglePlay}>
                        {isTop && isPlaying ? "⏸️" : "▶️"}
                      </ControlButton>
                      <ProgressBarWrapper onClick={handleProgressBarClick}>
                        <ProgressBar progress={progress} />
                      </ProgressBarWrapper>
                    </PlayerControls>
                  </CardContent>
                </Card>
              );
            })}

            {swipeHint && <SwipeHint>{swipeHint}</SwipeHint>}
          </CardContainer>
        )}
      </AnimatePresence>
    </FlashCardContainer>
  );
};

export default FlashCardPlayer;
