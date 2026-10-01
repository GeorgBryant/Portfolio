import "./ProjectLoader.css";

// Displayed above the mounted project until its scene reports a rendered frame.
export default function ProjectLoader() {
  return (
    <div className="project-loader" role="status" aria-live="polite">
      <div className="project-loader__content">
        <span>LOADING PROJECT</span>
        <div className="project-loader__track">
          <div className="project-loader__progress" />
        </div>
      </div>
    </div>
  );
}
