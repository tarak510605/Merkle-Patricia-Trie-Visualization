import React from "react";
import TrieVisualizer from "./components/TrieVisualizer";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Merkle Patricia Trie Visualizer</h1>
      <TrieVisualizer />
    </div>
  );
}

export default App;
