import React from "react";
import TrieVisualizer from "./components/Trieviz";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Merkle Patricia Trie Visualizer</h1>
      <TrieVisualizer />
    </div>
  );
}

export default App;

// comments new