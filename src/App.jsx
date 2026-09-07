import { useState } from "react";
import "./App.css";
import { projects } from "./data/projects";
import Radio from "./components/Radio";
import ShaderLab from "./projects/shader-lab/App";

function App() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [activeProject, setActiveProject] = useState(null);
  const[infoOpen, setInfoOpen] = useState(false);
  const currentProject = projects[activeIndex];
  const displayedProject =
  activeProject !== null
    ? projects.find((project) => project.slug === activeProject)
    : currentProject;

  function openProject() {
    if (currentProject.title === "SHADER LAB") {
      setActiveProject("shader-lab");
    }
  }

  function closeProject() {
    setActiveProject(null);
  }

  return (
    <main className="portfolio">
      <header className="portfolio__header">
        <h1>GEORGE BRYANT</h1>
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
          projects.map((project, index) => {
            const offset = index - activeIndex;
            const isActive = index === activeIndex;

            return (
              <div
                key={project.id}
                className="project-tile"
                data-offset={offset}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={isActive ? openProject : undefined}
              >
                <span>{project.title}</span>
              </div>
            );
          })
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

      <h2>{displayedProject.title}</h2>

<p>{displayedProject.info}</p>
    </div>
  </div>
)}
    </main>
  );
}

export default App;