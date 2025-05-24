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
  background: #1db954;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const CardContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const Card = styled(motion.div)`
  width: 300px;
  height: 400px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  position: absolute;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const CardImage = styled.img`
  width: 100%;
  height: 60%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
  background: white;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #1db954;
  &:hover {
    color: #1ed760;
  }
`;

const ProgressBarWrapper = styled.div`
  flex-grow: 1;
  height: 8px;
  background: #ccc;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: #1db954;
  border-radius: 5px;
  width: ${(props) => props.progress}%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
`;

const SwipeHint = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 1.1rem;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: pulse 2s infinite ease-in-out;

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

  const cards = [
    { id: 1, title: "Summer Vibes", image: cardImage, audio: audio1 },
    { id: 2, title: "Chill Mix", image: cardImage, audio: audio1 },
    { id: 3, title: "Workout Beats", image: cardImage, audio: audio1 },
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

  let swipeHint = null;
  if (currentIndex < cards.length - 1) {
    swipeHint = <>← Swipe left</>;
  } else if (currentIndex > 0) {
    swipeHint = <>Swipe right →</>;
  }

  return (
    <FlashCardContainer>
      <OpenButton onClick={() => setIsOpen(true)}>Open Flash Cards</OpenButton>

      <AnimatePresence>
        {isOpen && (
          <CardContainer
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
