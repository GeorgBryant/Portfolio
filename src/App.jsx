
import {useMemo,useRef,useState,useEffect,} from "react";
import { createPortal } from "react-dom";
import ProjectLoader from "./components/ProjectLoader";

import "./App.css";
import { projects } from "./data/projects";
import Radio from "./components/Radio";
import ShaderLab from "./projects/shader-lab/App";
import PRLeaderboard from "./projects/pr-leaderboard/App";
import Cornfield from "./projects/cornfield/App";
import "./projects/pr-leaderboard/Embedded.css";

function App() {
  const backgrounds = [
    "/backgrounds/bg-01.jpg",
    "/backgrounds/bg-02.jpg",
  ];

  const backgroundImage = useMemo(() => {
    return backgrounds[
      Math.floor(Math.random() * backgrounds.length)
    ];
  }, []);

  // STATE

  const [activeIndex, setActiveIndex] = useState(2);
  const [activeProject, setActiveProject] = useState(null);
  const [projectReady, setProjectReady] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // REFS

  const prThemeRef = useRef(null);
  const cornThemeRef = useRef(null);
  const dragStartX = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const dragVelocity = useRef(0);
  const didDrag = useRef(false);

  // CURRENT PROJECT

  const currentProject = projects[activeIndex];

const displayedProject = activeProject
  ? projects.find(
      (project) => project.slug === activeProject
    )
  : null;

  // PROJECT NAVIGATION

function openProject() {
  if (
    ![
      "shader-lab",
      "pr-leaderboard",
      "cornfield",
    ].includes(currentProject.slug)
  ) {
    return;
  }

  setInfoOpen(false);
  setProjectReady(false);

  const theme =
    currentProject.slug === "pr-leaderboard"
      ? prThemeRef.current
      : currentProject.slug === "cornfield"
        ? cornThemeRef.current
        : null;

  if (theme) {
    theme.currentTime = 0;
    theme.volume = 0.6;
    theme.play().catch(console.warn);
  }

  setActiveProject(currentProject.slug);
}

function closeProject() {
  [prThemeRef, cornThemeRef].forEach((ref) => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  });

  setInfoOpen(false);
  setProjectReady(false);
  setActiveProject(null);
}

  // CAROUSEL DRAGGING

  function handlePointerDown(event) {
    dragStartX.current = event.clientX;
    lastPointerX.current = event.clientX;
    lastPointerTime.current = performance.now();

    dragVelocity.current = 0;
    didDrag.current = false;

    setIsDragging(true);
  }

  function handlePointerMove(event) {
    if (!isDragging) return;

    const now = performance.now();
    const deltaTime =
      now - lastPointerTime.current;

    const deltaX =
      event.clientX - lastPointerX.current;

    if (deltaTime > 0) {
      dragVelocity.current =
        deltaX / deltaTime;
    }

    const totalDrag =
      event.clientX - dragStartX.current;

    if (
      Math.abs(totalDrag) > 15 &&
      !didDrag.current
    ) {
      didDrag.current = true;

      event.currentTarget.setPointerCapture(
        event.pointerId
      );
    }

    setDragX(totalDrag);

    lastPointerX.current = event.clientX;
    lastPointerTime.current = now;
  }

  function handlePointerUp(event) {
    if (!isDragging) return;

    setIsDragging(false);

    const momentum =
      dragVelocity.current * 180;

    const projectedMovement =
      dragX + momentum;

    const pixelsPerProject = 170;

    let projectShift = Math.round(
      -projectedMovement / pixelsPerProject
    );

    if (
      projectShift === 0 &&
      Math.abs(projectedMovement) > 50
    ) {
      projectShift =
        projectedMovement < 0 ? 1 : -1;
    }

    const nextIndex = Math.max(
      0,
      Math.min(
        projects.length - 1,
        activeIndex + projectShift
      )
    );

    if (didDrag.current) {
      setActiveIndex(nextIndex);
    }

    setDragX(0);

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  }

  // INFO OVERLAY KEYBOARD CONTROL

  useEffect(() => {
    if (!infoOpen) return;

    const onEscape = (event) => {
      if (event.key === "Escape") {
        setInfoOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      onEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onEscape
      );
    };
  }, [infoOpen]);

  // RENDER

  return (
    <main
      className={`portfolio ${
        activeProject
          ? "portfolio--app-open"
          : ""
      }`}
    >
      {/* PROJECT AUDIO */}

      <audio
        ref={prThemeRef}
        src="/pr-leaderboard/audio/pr-theme.wav"
        loop
        preload="auto"
      />

      <audio
        ref={cornThemeRef}
        src="/cornfield/audio/Calm.wav"
        loop
        preload="auto"
      />

      {/* BACKGROUND */}

      <div
        className="portfolio__background"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* PORTFOLIO HEADER */}

      {!activeProject && (
        <header className="portfolio__header">
          <h1>George Bryant</h1>
        </header>
      )}

      {/* PROJECT STAGE */}

<section className="project-stage">
  {[
    "shader-lab",
    "pr-leaderboard",
    "cornfield",
  ].includes(activeProject) ? (
    <div
      className={`project-view project-view--immersive ${
        activeProject === "pr-leaderboard"
          ? "project-view--pr"
          : ""
      }`}
    >
      {/* IMMERSIVE CONTROLS */}

      <div className="project-view__toolbar">
        <div className="project-view__actions">
          <button
            className="project-view__info"
            onClick={() => setInfoOpen(true)}
          >
            PROJECT INFO
          </button>

          <button
            className="project-view__close"
            onClick={closeProject}
          >
            CLOSE ×
          </button>
        </div>
      </div>

{/* EMBEDDED PROJECT */}

{activeProject === "shader-lab" ? (
  <ShaderLab onReady={() => setProjectReady(true)} />
) : activeProject === "pr-leaderboard" ? (
  <div className="pr-embedded">
    <PRLeaderboard onReady={() => setProjectReady(true)} />
  </div>
) : (
  <Cornfield onReady={() => setProjectReady(true)} />
)}
{!projectReady && <ProjectLoader />}


    </div>
  ) : (
    /* PROJECT CAROUSEL */

    <div
      className={`project-carousel ${
        isDragging ? "is-dragging" : ""
      }`}
      style={{
        "--drag-x": `${dragX}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {projects.map((project, index) => {
        const offset = index - activeIndex;
        const isActive = index === activeIndex;

        return (
          <div
            key={project.id}
            className="project-tile"
            data-offset={offset}
            onClick={() => {
              if (didDrag.current) {
                didDrag.current = false;
                return;
              }

              if (isActive) {
                openProject();
              } else {
                setActiveIndex(index);
              }
            }}
          >
            {(project.slug === "shader-lab" ||
              project.slug === "pr-leaderboard") && (
              <video
                className="project-tile__video"
                src={`/videos/${project.slug}.mp4`}
                autoPlay
                muted
                loop
                playsInline
              />
            )}

            <span>{project.title}</span>
          </div>
        );
      })}
    </div>
  )}
</section>

      {/* PORTFOLIO CONTROLS */}

      <div
        className={`portfolio__controls ${
          activeProject
            ? "portfolio__controls--hidden"
            : ""
        }`}
      >
        <button
          onClick={() => setInfoOpen(true)}
        >
          PROJECT INFO
        </button>

        <Radio
          paused={
            activeProject === "pr-leaderboard" ||
            activeProject === "cornfield"
          }
        />

        <a
          href="https://github.com/GeorgBryant"
          target="_blank"
          rel="noreferrer"
        >
          GITHUB ↗
        </a>
      </div>

      {/* PROJECT INFO PORTAL */}

      {infoOpen &&
        createPortal(
          <div
            className="project-info-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setInfoOpen(false);
              }
            }}
          >
            <div className="project-info-panel">
              <button
                className="project-info-close"
                onClick={() =>
                  setInfoOpen(false)
                }
              >
                CLOSE
              </button>

              <h2>
                {displayedProject
                  ? displayedProject.title
                  : "GEORGE BRYANT"}
              </h2>

              <p>
                {displayedProject
                  ? displayedProject.info
                  : "Portfolio information goes here."}
              </p>
            </div>
          </div>,
          document.body
        )}
    </main>
  );
}

export default App;
