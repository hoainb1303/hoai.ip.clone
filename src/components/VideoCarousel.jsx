import { hightlightsSlides } from "../constants";

const VideoCarousel = () => {
  return (
    <>
      <div className="flex item-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video id="videp" playsInline={true} preload="auto" muted>
                  <source src={list.video} type="video/mp4"></source>
                </video>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VideoCarousel;
