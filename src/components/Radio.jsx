import { useCallback, useEffect, useRef, useState } from "react";
import { tracks } from "../data/tracks";

const BAR_COUNT = 120;

export default function Radio({ paused = false }) {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const wantsPlayback = useRef(false);
  const waveform = useRef([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const track = tracks[trackIndex];

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const bars = waveform.current;
    if (!canvas || !bars.length) return;
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const progress = duration ? currentTime / duration : 0;
    const stride = width / bars.length;
    const barWidth = Math.max(1, stride - 1.5);
    bars.forEach((sample, index) => {
      const barHeight = Math.max(2, sample * (height - 4));
      ctx.fillStyle = index / bars.length <= progress
        ? "rgba(255,255,255,.95)"
        : "rgba(255,255,255,.32)";
      ctx.fillRect(index * stride, (height - barHeight) / 2, barWidth, barHeight);
    });
  }, [currentTime, duration]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    waveform.current = [];
    setCurrentTime(0);
    setDuration(0);
    async function loadWaveform() {
      let context;
      try {
        const response = await fetch(track.src, { signal: controller.signal });
        if (!response.ok) throw new Error(`Audio request failed: ${response.status}`);
        const bytes = await response.arrayBuffer();
        if (cancelled) return;
        context = new AudioContext();
        const decoded = await context.decodeAudioData(bytes);
        if (cancelled) return;
        const channel = decoded.getChannelData(0);
        const blockSize = Math.max(1, Math.floor(channel.length / BAR_COUNT));
        const samples = Array.from({ length: BAR_COUNT }, (_, i) => {
          const start = i * blockSize;
          const end = Math.min(start + blockSize, channel.length);
          let sum = 0;
          for (let j = start; j < end; j++) sum += Math.abs(channel[j]);
          return sum / Math.max(1, end - start);
        });
        const peak = Math.max(...samples);
        waveform.current = samples.map(value => peak ? value / peak : 0);
        drawWaveform();
      } catch (error) {
        if (!cancelled) console.error("Could not generate waveform:", error);
      } finally {
        if (context) await context.close();
      }
    }
    loadWaveform();
    return () => { cancelled = true; controller.abort(); };
  }, [track.src]); // Drawing also runs when waveform data becomes available.

  useEffect(() => { drawWaveform(); }, [drawWaveform]);
  useEffect(() => {
    const observer = new ResizeObserver(drawWaveform);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [drawWaveform]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (paused || !wantsPlayback.current) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    let cancelled = false;
    audio.play()
      .then(() => { if (!cancelled) setIsPlaying(true); })
      .catch(() => { if (!cancelled) setIsPlaying(false); });
    return () => { cancelled = true; };
  }, [paused, trackIndex]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || paused) return;
    if (wantsPlayback.current) {
      wantsPlayback.current = false;
      audio.pause();
      setIsPlaying(false);
    } else {
      wantsPlayback.current = true;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }

  function changeTrack(direction) {
    if (!tracks.length) return;
    wantsPlayback.current = true;
    setCurrentTime(0);
    setDuration(0);
    setTrackIndex(index => (index + direction + tracks.length) % tracks.length);
  }

  function seekTo(clientX, element) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = element.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    audio.currentTime = fraction * duration;
    setCurrentTime(audio.currentTime);
  }

  return (
    <div className="radio">
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onVolumeChange={event => setVolume(event.currentTarget.volume)}
        onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)}
        onDurationChange={event => {
          const value = event.currentTarget.duration;
          if (Number.isFinite(value)) setDuration(value);
        }}
        onLoadedMetadata={event => {
          event.currentTarget.volume = volume;
          const value = event.currentTarget.duration;
          if (Number.isFinite(value)) setDuration(value);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => changeTrack(1)}
      />
      <div className="radio__top">
        <span className="radio__title">{track.title}</span>
        <div className="radio__navigation">
          <button type="button" onClick={() => changeTrack(-1)} aria-label="Previous track">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M11 6 5 12l6 6M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
          </button>
        <span className="radio__count">
          {String(trackIndex + 1).padStart(2, "0")} / {String(tracks.length).padStart(2, "0")}
        </span>
          <button type="button" onClick={() => changeTrack(1)} aria-label="Next track">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="m13 6 6 6-6 6m6-6H5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
          </button>
        </div>
      </div>
      <div className="radio__bottom">
        <button type="button" className="radio__play" onClick={togglePlay}
          disabled={paused} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <rect x="5" y="4" width="5" height="16" fill="currentColor" />
              <rect x="14" y="4" width="5" height="16" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 3.5L20 12 6 20.5Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="radio__progress" role="slider" tabIndex={0}
          aria-label="Seek through track" aria-valuemin={0} aria-valuemax={100}
          aria-valuenow={duration ? Math.round(currentTime / duration * 100) : 0}
          onClick={event => seekTo(event.clientX, event.currentTarget)}
          onKeyDown={event => {
            if (!audioRef.current || !duration) return;
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            audioRef.current.currentTime = Math.max(0, Math.min(duration,
              audioRef.current.currentTime + (event.key === "ArrowRight" ? 5 : -5)));
            setCurrentTime(audioRef.current.currentTime);
          }}>
          <canvas ref={canvasRef} className="radio__waveform" />
        </div>
      </div>
      <div className="radio__volume">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          {volume > 0 && <path d="M16 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
          {volume > 0.5 && <path d="M18 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          aria-label="Volume"
          style={{ "--volume": `${volume * 100}%` }}
          onChange={event => {
            const next = Number(event.target.value);
            setVolume(next);
            if (audioRef.current) audioRef.current.volume = next;
          }}
        />
      </div>
    </div>
  );
}
