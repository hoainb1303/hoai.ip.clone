import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

import { hightlightsSlides } from "../constants";
import { replayImg, playImg, pauseImg } from "../utils";
import { useEffect, useRef, useState } from "react";

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useEffect(() => {
    // 3 is the number of videos in the carousel
    if (loadedData.length > hightlightsSlides.length - 1) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  // Function to handle loaded metadata for each video
  const handleLoadedMetadata = (i, e) => setLoadedData((pre) => [...pre, e]);

  // a touch to activate video cause browser on iOS cant not be activate by
  const handleUserGesture = () => {
    videoRef.current.forEach((video) => {
      video.play();
      video.pause();
    });
  };

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;
    let div = videoDivRef.current;

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress != currentProgress) {
            currentProgress = progress;
            // Update the width of the span based on the progress
            gsap.to(div[videoId], {
              width:
                window.innerWidth < 760
                  ? // For mobile devices
                    "10vw"
                  : window.innerWidth < 1200
                  ? // For tablets
                    "10vw"
                  : // For larger screens
                    "4vw",
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        onComplete: () => {
          gsap.to(div[videoId], {
            width: "12px",
          });
          gsap.to(span[videoId], {
            backgroundColor: "#afafaf",
          });
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        // Add the animation update to the GSAP ticker if the video is playing
        gsap.ticker.add(animUpdate);
      } else {
        // Remove the animation update from the GSAP ticker if the video is paused
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, isPlaying]);

  //Multifuction to handle multiple type of video action
  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({
          // to end the video and move the next video
          ...pre,
          isEnd: true,
          videoId: i + 1,
        }));
        break;
      case "video-last":
        // to notice that this video is the last of the varousel
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case "video-reset":
        // to reset the varousel, play from the first video
        setVideo((pre) => ({ ...pre, isLastVideo: false, videoId: 0 }));
        break;

      case "play":
        // to play video when it's paused and to pause when it's playing
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  useGSAP(() => {
    // Move the slider to the correct position based on videoId
    gsap.to("#slider", {
      translateX: `${-100 * videoId}%`,
      duration: 2,
      ease: "power2.inOut",
    });

    // To trigger the video play when the video is in view (top only)
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({ ...pre, startPlay: true, isPlaying: true }));
      },
    });
  }, [isEnd, videoId]);

  return (
    <>
      <div className="flex item-center" onClick={handleUserGesture}>
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  // to set ref for each video element
                  ref={(el) => (videoRef.current[i] = el)}
                  className={`${list.id === 2 && "translate-x-44"}`}
                  onEnded={() => {
                    if (i === 2) {
                      // Because the 3rd video is too short, we need to wait for 2 seconds
                      setTimeout(() => handleProcess("video-end", i), 2000);
                    } else if (i !== hightlightsSlides.length - 1) {
                      // End current one and move to the next
                      handleProcess("video-end", i);
                    } else {
                      // If it's the last video, set isLastVideo to true
                      handleProcess("video-last");
                    }
                  }}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      //To copy all values from prevVideo but change isPlaying to true
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedData={(e) => handleLoadedMetadata(i, e)}
                >
                  <source src={list.video} type="video/mp4"></source>
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-center relative mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {
            // underscore _ means we are not using the value
            videoRef.current.map((_, i) => (
              // to reference each video div and span
              <span
                key={i}
                ref={(el) => (videoDivRef.current[i] = el)}
                className="mx-2 w-3 h-3 bg-gray-200 rounded-full cursor-pointer relative"
              >
                <span
                  className="absolute w-full h-full rounded-full"
                  ref={(el) => (videoSpanRef.current[i] = el)}
                ></span>
              </span>
            ))
          }
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "Replay" : !isPlaying ? "Play" : "Pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : () => handleProcess("play")
            }
          ></img>
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
