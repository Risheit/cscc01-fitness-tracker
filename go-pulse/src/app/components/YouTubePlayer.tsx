"use client";

declare global {
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

import { useRef, useEffect, useState } from "react";

const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [origin, setOrigin] = useState("");
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);

    // YouTube API ready function
    window.onYouTubeIframeAPIReady = () => {
      if (window.YT && iframeRef.current) {
        setIsApiReady(true);
      }
    };

    // Load the script dynamically if YT is not available
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      setIsApiReady(true);
    }
  }, []);

  useEffect(() => {
    if (isApiReady && iframeRef.current && window.YT) {
      new window.YT.Player(iframeRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
        },
      });
    }
  }, [isApiReady, videoId]);

  return origin ? (
    <iframe
      ref={iframeRef}
      id="player"
      width="640"
      height="390"
      src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${origin}`}
      frameBorder="0"
      allowFullScreen
    ></iframe>
  ) : null;
};

export default YouTubePlayer;
