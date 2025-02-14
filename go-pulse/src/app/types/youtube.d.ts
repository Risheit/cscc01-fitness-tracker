declare namespace YT {
    interface PlayerEvent {
      target: Player;
    }
  
    class Player {
      constructor(
        element: string | HTMLElement,
        options?: {
          height?: string;
          width?: string;
          videoId?: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: PlayerEvent) => void;
            onStateChange?: (event: PlayerEvent) => void;
            onError?: (event: PlayerEvent) => void;
          };
        }
      );
    }
  }
  