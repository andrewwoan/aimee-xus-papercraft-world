import React, { useRef, useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import "./LoadingScreen.css";
import { useExperienceStore } from "../../store/useExperienceStore";

const LoadingScreen = () => {
  const { progress, active } = useProgress();
  const [maxProgress, setMaxProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [gone, setGone] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const setIsExperienceReady = useExperienceStore(
    (state) => state.setIsExperienceReady,
  );
  const isSceneReady = useExperienceStore((state) => state.isSceneReady);

  const tlRef = useRef(null);
  const trRef = useRef(null);
  const blRef = useRef(null);
  const brRef = useRef(null);
  const loadingRef = useRef(null);

  useEffect(() => {
    if (active && progress === 100) return;
    setMaxProgress((prev) => (progress > prev ? progress : prev));
  }, [progress, active]);

  useGSAP(() => {
    if (!revealed) return;

    setIsExperienceReady(true);

    gsap.to(tlRef.current, {
      top: "-100%",
      left: "-100%",
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.to(trRef.current, {
      top: "-100%",
      right: "-100%",
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.to(blRef.current, {
      bottom: "-100%",
      left: "-100%",
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.to(brRef.current, {
      bottom: "-100%",
      right: "-100%",
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        setGone(true);
      },
    });
  }, [revealed]);

  // Assets finished downloading AND the scene has mounted/compiled
  const isLoaded = maxProgress === 100 && isSceneReady;

  if (gone) return null;

  return (
    <>
      <div className="loading-screen">
        <div ref={tlRef} className="quadrant quadrant--tl" />
        <div ref={trRef} className="quadrant quadrant--tr" />
        <div ref={blRef} className="quadrant quadrant--bl" />
        <div ref={brRef} className="quadrant quadrant--br" />

        {!revealed && (
          <>
            <div ref={loadingRef} className="loading-bar-container">
              <div
                className="loading-bar-fill"
                style={{ width: `${maxProgress}%` }}
              />
              <div
                className="loading-bar-indicator"
                style={{
                  left: `${maxProgress}%`,
                  transform: "translate(-65px, -50%)",
                  backgroundImage: `url("/images/${isHovered ? "head_smile" : "head"}.webp")`,
                }}
              />
            </div>
            <h1 className="title">Aimee Xu's Papercraft World</h1>

            {/* Lol don't do this this is cringe */}
            <div
              style={{
                backgroundImage: 'url("/images/head_smile.webp")',
                width: 0,
                height: 0,
                visibility: "hidden",
                position: "absolute",
              }}
            />

            <div
              style={{
                backgroundImage: 'url("/images/head.webp")',
                width: 0,
                height: 0,
                visibility: "hidden",
                position: "absolute",
              }}
            />
            <div
              style={{
                backgroundImage: 'url("/images/red.webp")',
                width: 0,
                height: 0,
                visibility: "hidden",
                position: "absolute",
              }}
            />
            <div
              style={{
                backgroundImage: 'url("/images/blue.webp")',
                width: 0,
                height: 0,
                visibility: "hidden",
                position: "absolute",
              }}
            />
            <div
              style={{
                backgroundImage: 'url("/images/green.webp")',
                width: 0,
                height: 0,
                visibility: "hidden",
                position: "absolute",
              }}
            />
            <div
              style={{
                backgroundImage: 'url("/images/orange.webp")',
                width: 0,
                height: 0,
                visibility: "hidden",
                position: "absolute",
              }}
            />

            <a
              href="https://github.com/andrewwoan/aimee-weis-papercraft-world"
              className="credits-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              See full list of credits here!!
            </a>

            <div className="loading-below">
              <div className="instructions">~ Swipe/Scroll to navigate ~</div>
              <div className="enter-slot">
                {isLoaded && (
                  <button
                    className="enter-button"
                    onClick={() => setRevealed(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    Enter!
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="torn" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.065"
              numOctaves="4"
              seed="2"
            />
            <feDisplacementMap
              in="SourceGraphic"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default LoadingScreen;
