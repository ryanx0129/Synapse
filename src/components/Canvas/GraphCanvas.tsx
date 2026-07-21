import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from "react";
import FlowchartView from "./FlowchartView";
import { useSynapseStore } from "@/stores/useSynapseStore";

const ThreeGalaxyView = lazy(() => import("./ThreeGalaxyView"));

class WebGlBoundary extends Component<
  { children: ReactNode; onFallback: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("3D renderer unavailable; using 2D fallback", error.message, info.componentStack);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="canvas-empty" role="alert">
        <strong>3D rendering is unavailable on this device.</strong>
        <span>The full learning experience remains available in the 2D Path view.</span>
        <button className="button-primary" onClick={this.props.onFallback}>
          Open 2D Path
        </button>
      </div>
    );
  }
}

export function GraphCanvas() {
  const view = useSynapseStore((state) => state.view);
  const setView = useSynapseStore((state) => state.setView);
  return (
    <main className="canvas-shell">
      {view === "2d" ? (
        <FlowchartView />
      ) : (
        <WebGlBoundary onFallback={() => setView("2d")}>
          <Suspense
            fallback={
              <div className="canvas-loading" role="status">
                <div className="orbital-loader" />
                <span>Initializing the 3D knowledge field…</span>
              </div>
            }
          >
            <ThreeGalaxyView />
          </Suspense>
        </WebGlBoundary>
      )}
    </main>
  );
}

