import { useEffect, useRef } from "react";
import { styles } from "./styles";

export default function MenuParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const container = canvas.parentElement;

    let animationFrame;
    let particles = [];

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    function resizeCanvas() {
      const bounds = container.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;

      canvas.width = bounds.width * pixelRatio;
      canvas.height = bounds.height * pixelRatio;

      canvas.style.width = `${bounds.width}px`;
      canvas.style.height = `${bounds.height}px`;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );

      createParticles(bounds.width, bounds.height);
    }

    function createParticles(width, height) {
      const particleCount = Math.floor(
        (width * height) / 9000
      );

      particles = Array.from(
        { length: particleCount },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,

          velocityX:
            (Math.random() - 0.5) * 0.12,

          velocityY:
            (Math.random() - 0.5) * 0.12,

          radius:
            Math.random() * 1.2 + 0.4,
        })
      );
    }

    function handlePointerMove(event) {
      const bounds = canvas.getBoundingClientRect();

      mouse.x = event.clientX - bounds.left;
      mouse.y = event.clientY - bounds.top;
      mouse.active = true;
    }

    function handlePointerLeave() {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    }

    function updateParticle(
      particle,
      width,
      height
    ) {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      if (particle.x < 0) {
        particle.x = width;
      }

      if (particle.x > width) {
        particle.x = 0;
      }

      if (particle.y < 0) {
        particle.y = height;
      }

      if (particle.y > height) {
        particle.y = 0;
      }

      if (!mouse.active) {
        return;
      }

      const differenceX = particle.x - mouse.x;
      const differenceY = particle.y - mouse.y;

      const distance = Math.sqrt(
        differenceX * differenceX +
        differenceY * differenceY
      );

      const interactionRadius = 75;

      if (
        distance > 0 &&
        distance < interactionRadius
      ) {
        const force =
          (interactionRadius - distance) /
          interactionRadius;

        particle.x +=
          (differenceX / distance) * force * 2.5;

        particle.y +=
          (differenceY / distance) * force * 2.5;
      }
    }

    function animate() {
      const bounds = container.getBoundingClientRect();

      context.clearRect(
        0,
        0,
        bounds.width,
        bounds.height
      );

      for (const particle of particles) {
        updateParticle(
          particle,
          bounds.width,
          bounds.height
        );

        context.beginPath();

        context.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        context.fillStyle =
          "rgba(255, 255, 255, 0.10)";

        context.fill();
      }

      animationFrame =
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate();

    const resizeObserver =
      new ResizeObserver(resizeCanvas);

    resizeObserver.observe(container);

    container.addEventListener(
      "pointermove",
      handlePointerMove
    );

    container.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    return () => {
      cancelAnimationFrame(animationFrame);

      resizeObserver.disconnect();

      container.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      container.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={styles.menuParticles}
      aria-hidden="true"
    />
  );
}