import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/app/App";
import { machineLearningPreset } from "@/data/presets";
import { useSynapseStore } from "@/stores/useSynapseStore";
import { repositories } from "@/storage/repositories";

beforeEach(async () => {
  await repositories.resetLearning();
  await repositories.savePreference("view", "2d");
  await useSynapseStore.getState().loadPreset("preset-machine-learning");
  useSynapseStore.setState({ view: "2d", selectedConceptId: null, searchQuery: "" });
});

describe("preset study loop", () => {
  it("loads the preset and preserves selection while switching views", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText("Synapse")).toBeInTheDocument();
    expect(machineLearningPreset.nodes).toHaveLength(20);
    const search = screen.getByPlaceholderText("Search concepts…");
    await user.type(search, "Backpropagation");
    await user.click(within(screen.getByRole("list", { name: "Concept search results" })).getByRole("button"));
    expect(screen.getByRole("heading", { name: "Backpropagation" })).toBeInTheDocument();
    expect(document.querySelector(".formula-card .mfrac, .formula-card .frac-line")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: /3D Galaxy/i }));
    expect(screen.getByRole("heading", { name: "Backpropagation" })).toBeInTheDocument();
  });

  it("scores a correct answer, updates mastery, and exposes semantic status", async () => {
    const user = userEvent.setup();
    useSynapseStore.getState().selectConcept("ml-backpropagation");
    render(<App />);
    await user.type(
      screen.getByLabelText("Explain in your own words"),
      "The chain rule composes local derivatives backward through every layer to calculate gradients for the weights.",
    );
    await user.click(screen.getByRole("button", { name: "Verify knowledge" }));
    await waitFor(() => expect(screen.getByText("correct")).toBeInTheDocument());
    expect(screen.getAllByLabelText("Knowledge status: Mastered").length).toBeGreaterThan(0);
  });

  it("activates a repair path and starts its first recommendation", async () => {
    const user = userEvent.setup();
    useSynapseStore.getState().selectConcept("ml-vanishing-gradients");
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Diagnose path" }));
    expect(screen.getByRole("button", { name: "Start repair" })).toBeInTheDocument();
    expect(useSynapseStore.getState().repairPath.length).toBeGreaterThan(0);
  });

  it("validates empty pasted text and shows an actionable message", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Upload PDF \/ Text/i }));
    await user.click(screen.getByRole("button", { name: "Generate locally" }));
    expect(screen.getByText(/Paste plain text or Markdown before generating/)).toBeInTheDocument();
  });

  it("shows the session summary with distribution and next action", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Session summary" }));
    expect(screen.getByRole("heading", { name: "Learner twin update" })).toBeInTheDocument();
    expect(screen.getByText("Retrieval evidence")).toBeInTheDocument();
    expect(screen.getByText("Highest-risk gap")).toBeInTheDocument();
  });
});
