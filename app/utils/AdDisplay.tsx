import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaCompress } from "react-icons/fa";

interface AdContent {
  id: string;
  type: string;
  content: any;
}

interface AdDisplayProps {
  ads: AdContent[];
  adId: string;
}

const AdDisplay: React.FC<AdDisplayProps> = ({ ads, adId }) => {
  const ad = ads.find((ad) => ad.id === adId);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const handleImageClick = () => {
    if (imageContainerRef.current) {
      if (!document.fullscreenElement) {
        imageContainerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleExitFullScreenClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  return (
    <div className="mb-2 block bg-white p-2">
      {ad?.type === "images" ? (
        <div ref={imageContainerRef}>
          <Image
            key={ad.id}
            src={ad.content.image as string}
            width={728}
            height={90}
            alt={ad.id}
            className="w-full h-auto"
            onClick={handleImageClick}
          />
          {isFullScreen && (
            <div
              className="absolute top-4 right-4 text-white text-4xl cursor-pointer"
              onClick={handleExitFullScreenClick}
            >
              <FaCompress size={24} fill="blue" />
            </div>
          )}
        </div>
      ) : ad?.type === "code" ? (
        <p
          key={ad.id}
          dangerouslySetInnerHTML={{
            __html: ad.content || "",
          }}
        />
      ) : null}
    </div>
  );
};

export default AdDisplay;
