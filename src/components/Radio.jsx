import { useRef, useState } from "react";
import { tracks } from "../data/tracks";

export default function Radio() {
  const audioRef = useRef(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = tracks[trackIndex];

  function togglePlay() {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  function changeTrack(direction) {
    const nextIndex =
      (trackIndex + direction + tracks.length) % tracks.length;

    setTrackIndex(nextIndex);
    setIsPlaying(true);

    setTimeout(() => {
      audioRef.current?.play();
    }, 0);
  }

  return (
    <div className="radio">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={() => changeTrack(1)}
      />

      <div className="radio__title">
        {currentTrack.title}
      </div>

      <div className="radio__controls">
        <button onClick={() => changeTrack(-1)}>
          ←
        </button>

        <button onClick={togglePlay}>
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>

        <button onClick={() => changeTrack(1)}>
          →
        </button>
      </div>
    </div>
  );
}