import { useState } from "react";
import { BlockEditorPage } from "./BlockEditorPage";
import { PortfolioGeneratorPage } from "./PortfolioGeneratorPage";
import { usePortfolioStore } from "./store/portfolioStore";

type AppView = "generator" | "editor";

function App() {
  const [view, setView] = useState<AppView>("generator");
  const template = usePortfolioStore((state) => state.template);
  const resetPortfolio = usePortfolioStore((state) => state.resetPortfolio);

  const startOver = () => {
    resetPortfolio();
    setView("generator");
  };

  if (view === "editor" && template) {
    return (
      <>
        <button className="editor-new-portfolio" onClick={startOver}>
          새 포트폴리오
        </button>
        <BlockEditorPage />
      </>
    );
  }

  return <PortfolioGeneratorPage onGenerated={() => setView("editor")} />;
}

export default App;
