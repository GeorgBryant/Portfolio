import { useRef, useState } from "react";
import "./App.css";
import { projects } from "./data/projects";
import Radio from "./components/Radio";
import ShaderLab from "./projects/shader-lab/App";

function App() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [activeProject, setActiveProject] = useState(null);
  const[infoOpen, setInfoOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const dragVelocity = useRef(0);
  const didDrag = useRef(false);
  const currentProject = projects[activeIndex];
  const displayedProject =
  activeProject !== null
    ? projects.find((project) => project.slug === activeProject)
    : null;

  function openProject() {
    if (currentProject.title === "SHADER LAB") {
      setActiveProject("shader-lab");
    }
  }

  function closeProject() {
    setActiveProject(null);
  }

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
  const deltaTime = now - lastPointerTime.current;
  const deltaX = event.clientX - lastPointerX.current;

  if (deltaTime > 0) {
    dragVelocity.current = deltaX / deltaTime;
  }

  const totalDrag = event.clientX - dragStartX.current;

  if (Math.abs(totalDrag) > 15 && !didDrag.current) {
  didDrag.current = true;
  event.currentTarget.setPointerCapture(event.pointerId);
}

  setDragX(totalDrag);

  lastPointerX.current = event.clientX;
  lastPointerTime.current = now;
}

function handlePointerUp(event) {
  if (!isDragging) return;

  setIsDragging(false);

  const momentum = dragVelocity.current * 180;
  const projectedMovement = dragX + momentum;

  const pixelsPerProject = 170;

  let projectShift = Math.round(
    -projectedMovement / pixelsPerProject
  );

  if (
    projectShift === 0 &&
    Math.abs(projectedMovement) > 50
  ) {
    projectShift = projectedMovement < 0 ? 1 : -1;
  }

  const nextIndex = Math.max(
    0,
    Math.min(projects.length - 1, activeIndex + projectShift)
  );

  if (didDrag.current) {
    setActiveIndex(nextIndex);
  }

  setDragX(0);

  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
  event.currentTarget.releasePointerCapture(event.pointerId);
}
}

  return (
    <main className="portfolio">
      <header className="portfolio__header">
        <h1>George Bryant</h1>
      </header>

<section className="project-stage">
        {activeProject === "shader-lab" ? (
          <div className="project-view">
            <button
              className="project-view__close"
              onClick={closeProject}
            >
              CLOSE
            </button>

            <ShaderLab />
          </div>
) : (
  <div
    className={`project-carousel ${isDragging ? "is-dragging" : ""}`}
    style={{ "--drag-x": `${dragX}px` }}
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
                {project.slug === "shader-lab" && (
  <video
    className="project-tile__video"
    src="/videos/shader-lab.mp4"
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

      <div className="portfolio__controls">
        <button onClick={() => setInfoOpen(true)}>
          PROJECT INFO
        </button>

        <Radio />

        <a
          href="https://github.com/GeorgBryant"
          target="_blank"
          rel="noreferrer"
        >
          GITHUB ↗
        </a>
      </div>

      {infoOpen && (
  <div className="project-info-overlay">
    <div className="project-info-panel">
      <button
        className="project-info-close"
        onClick={() => setInfoOpen(false)}
      >
        CLOSE
      </button>

<h2>
  {displayedProject ? displayedProject.title : "GEORGE BRYANT"}
</h2>

<p>
  {displayedProject
    ? displayedProject.info
    : "Portfolio information goes here."}
</p>
    </div>
  </div>
)}
    </main>
  );
}

export default App;