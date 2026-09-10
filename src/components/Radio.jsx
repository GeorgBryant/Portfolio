import { useEffect, useRef, useState } from "react";
import { tracks } from "../data/tracks";

export default function Radio() {
  const audioRef = useRef(null);
  const waveformRef = useRef(null);
const waveformData = useRef([]);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);

  const currentTrack = tracks[trackIndex];

  useEffect(() => {
  let cancelled = false;

  async function generateWaveform() {
    try {
      const response = await fetch(currentTrack.src);
      const arrayBuffer = await response.arrayBuffer();

      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      if (cancelled) {
        await audioContext.close();
        return;
      }

      const channelData = audioBuffer.getChannelData(0);

      // Number of bars we'll eventually draw.
      const sampleCount = 120;
      const blockSize = Math.floor(
        channelData.length / sampleCount
      );

      const samples = [];

      for (let i = 0; i < sampleCount; i++) {
        let sum = 0;

        const start = i * blockSize;
        const end = Math.min(
          start + blockSize,
          channelData.length
        );

        for (let j = start; j < end; j++) {
          sum += Math.abs(channelData[j]);
        }

        samples.push(sum / (end - start));
      }

      // Normalise everything to 0 → 1.
      const max = Math.max(...samples);

      waveformData.current = samples.map((sample) =>
        max > 0 ? sample / max : 0
      );

      requestAnimationFrame(drawWaveform);
      

      await audioContext.close();
    } catch (error) {
      console.error("Could not generate waveform:", error);
    }
  }

  generateWaveform();

  return () => {
    cancelled = true;
  };
}, [currentTrack.src]);

useEffect(() => {
  drawWaveform();
}, [currentTime, duration]);

function drawWaveform() {
  const canvas = waveformRef.current;
  const samples = waveformData.current;

  if (!canvas || samples.length === 0) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext("2d");

  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const progress = duration
    ? currentTime / duration
    : 0;

  const gap = 2;
  const barWidth = Math.max(
    1,
    rect.width / samples.length - gap
  );

  samples.forEach((sample, index) => {
    const x = index * (rect.width / samples.length);

    const minHeight = 2;
    const height = Math.max(
      minHeight,
      sample * rect.height
    );

    const y = (rect.height - height) / 2;

    const barProgress = index / samples.length;

    ctx.fillStyle =
      barProgress <= progress
        ? "rgba(255, 255, 255, 0.9)"
        : "rgba(255, 255, 255, 0.22)";

    ctx.fillRect(x, y, barWidth, height);
  });
}

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

setCurrentTime(0);
setDuration(0);

    setTrackIndex(nextIndex);
    setIsPlaying(true);

    setTimeout(() => {
      audioRef.current?.play();
    }, 0);
  }

  function handleSeek(event) {
  if (!audioRef.current || !duration) return;

  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percentage = clickX / rect.width;

  const newTime = percentage * duration;

  audioRef.current.currentTime = newTime;
  setCurrentTime(newTime);
}

  return (
  <div className="radio">
    <audio
  ref={audioRef}
  src={currentTrack.src}
  preload="metadata"
  onTimeUpdate={(event) => {
    const audio = event.currentTarget;

    setCurrentTime(audio.currentTime);

    if (Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  }}
  onDurationChange={(event) => {
    const audio = event.currentTarget;

    if (Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  }}
  onLoadedMetadata={(event) => {
    const audio = event.currentTarget;

    if (Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  }}
  onEnded={() => changeTrack(1)}
/>

    <div className="radio__top">
      <span className="radio__title">
        {currentTrack.title}
      </span>

      <span className="radio__count">
        {String(trackIndex + 1).padStart(2, "0")} /{" "}
        {String(tracks.length).padStart(2, "0")}
      </span>
    </div>

    <div className="radio__bottom">
      <button
        className="radio__play"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "Ⅱ" : "▶"}
      </button>

<div
  className="radio__progress"
  onClick={handleSeek}
>
  <canvas
    ref={waveformRef}
    className="radio__waveform"
  />
</div>

      <div className="radio__skip">
        <button
          onClick={() => changeTrack(-1)}
          aria-label="Previous track"
        >
          ←
        </button>

        <button
          onClick={() => changeTrack(1)}
          aria-label="Next track"
        >
          →
        </button>
      </div>
    </div>
  </div>
);
}