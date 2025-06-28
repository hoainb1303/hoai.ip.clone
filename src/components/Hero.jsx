import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "../utils";

const Hero = () => {
  // React hook to set the video source based on the current screen width
  const [videoSrc, setVideoSrc] = useState(
    window.innerWidth < 760 ? smallHeroVideo : heroVideo
  );

  // Function to change the video source when screen width changes
  const handleVideoSrcSet = () => {
    if (window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo);
    } else {
      setVideoSrc(heroVideo);
    }
  };

  // Effect to add event listener for window resize, to call handleVideoSrcSet
  useEffect(() => {
    window.addEventListener("resize", handleVideoSrcSet);
    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener("resize", handleVideoSrcSet);
    };
  }, []);

  useGSAP(() => {
    // We can use id or className to target elements, example: "#hero" or ".hero-title"
    gsap.to("#hero", {
      opacity: 1,
      delay: 1.5,
      duration: 1,
      ease: "easeInOut",
    });
    gsap.to("#cta", {
      opacity: 1,
      y: -50,
      delay: 2.5,
      duration: 1,
      ease: "easeInOut",
    });
  }, []);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero" className="hero-title">
          iPhone 15 Pro
        </p>
        <div className="md:w-10/12 w-9/12">
          <video
            className="pointer-events-none"
            autoPlay
            muted
            playsInline={true}
            key={videoSrc}
          >
            <source src={videoSrc} type="video/mp4"></source>
          </video>
        </div>
      </div>

      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20"
      >
        <a href="#highlights" className="btn">
          Buy
        </a>
        <p className="font-normal text-xl">From $999 or $199/month</p>
      </div>
    </section>
  );
};

export default Hero;
