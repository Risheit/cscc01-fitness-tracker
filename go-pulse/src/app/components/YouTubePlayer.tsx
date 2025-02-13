"use client"; 

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

import { useRef, useEffect, useState } from "react";

const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [origin, setOrigin] = useState("");
  const [isApiReady, setIsApiReady] = useState(false); // Track API readiness

  useEffect(() => {
    setOrigin(window.location.origin);
    
    // Define globally for YouTube API
    window.onYouTubeIframeAPIReady = () => {
      if (window.YT && iframeRef.current) {
        setIsApiReady(true);
      }
    };

    // Load the YouTube Iframe API script
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (isApiReady && iframeRef.current) {
      new window.YT.Player(iframeRef.current);
    }
  }, [isApiReady]); // Re-run when the API is ready

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
