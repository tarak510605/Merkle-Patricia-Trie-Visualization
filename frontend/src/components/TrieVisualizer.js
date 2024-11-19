import React, { useState } from "react";
import ReactFlow, { Controls } from "react-flow-renderer";

const TrieVisualizer = () => {
  const [selectedTrie, setSelectedTrie] = useState("Merkle Patricia Trie");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [trieData, setTrieData] = useState({
    "Merkle Patricia Trie": {},
    "Storage Trie": {},
    "Transaction Trie": {},
    "Receipt Trie": {},
  });
  const [isGraphView, setIsGraphView] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleInsert = () => {
    if (!key || !value) return;

    const updatedData = { ...trieData };

    // Update all tries automatically
    updatedData["Merkle Patricia Trie"][key] = value;
    updatedData["Storage Trie"][key] = value;
    updatedData["Transaction Trie"][key] = { data: value };
    updatedData["Receipt Trie"][key] = { status: "success", data: value };

    setTrieData(updatedData);
    updateVisualization(updatedData[selectedTrie]);
  };

  const handleDelete = () => {
    if (!key) return;

    const updatedData = { ...trieData };

    // Delete key from all tries
    delete updatedData["Merkle Patricia Trie"][key];
    delete updatedData["Storage Trie"][key];
    delete updatedData["Transaction Trie"][key];
    delete updatedData["Receipt Trie"][key];

    setTrieData(updatedData);
    updateVisualization(updatedData[selectedTrie]);
  };

  const handleModify = () => {
    handleInsert(); // Modify is essentially reinserting with the new value.
  };

  const updateVisualization = (data) => {
    if (isGraphView) {
      updateGraph(data);
    }
  };

  const updateGraph = (data) => {
    const newNodes = [{ id: "root", data: { label: "Root" }, position: { x: 250, y: 50 } }];
    const newEdges = [];
    let yOffset = 100;

    Object.keys(data).forEach((key, index) => {
      let currentNode = "root";
      [...key].forEach((char, i) => {
        const nextNode = `${currentNode}-${char}`;
        if (!newNodes.find((node) => node.id === nextNode)) {
          newNodes.push({
            id: nextNode,
            data: { label: char },
            position: { x: 250 + i * 100, y: yOffset + index * 100 },
          });
        }
        if (!newEdges.find((edge) => edge.id === `${currentNode}-${nextNode}`)) {
          newEdges.push({ id: `${currentNode}-${nextNode}`, source: currentNode, target: nextNode });
        }
        currentNode = nextNode;
      });

      const valueNode = `${currentNode}-value`;
      const valueLabel =
        selectedTrie === "Merkle Patricia Trie"
          ? `Value: ${data[key]}\nHash: 5994471abb0112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cafc5`
          : selectedTrie === "Storage Trie"
          ? `Storage: ${data[key]}`
          : selectedTrie === "Transaction Trie"
          ? `Transaction Data: ${JSON.stringify(data[key])}`
          : `Receipt Data: ${JSON.stringify(data[key])}`;

      newNodes.push({
        id: valueNode,
        data: { label: valueLabel },
        position: { x: 350, y: yOffset + index * 100 },
      });
      newEdges.push({ id: `${currentNode}-${valueNode}`, source: currentNode, target: valueNode });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const getTextVisualization = () => {
    const data = trieData[selectedTrie];

    // Helper function for formatting Merkle Patricia Trie as a hierarchy
    const formatKey = (key, value, level = 0) => {
      const indent = "  ".repeat(level);
      let result = `${indent}[${key[0]}]\n`;
      if (key.length > 1) {
        result += formatKey(key.slice(1), value, level + 1);
      } else {
        result += `${"  ".repeat(level + 1)}Value: ${value}\n`;
        const simulatedHash = "5994471abb0112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cafc5";
        result += `${"  ".repeat(level + 1)}Hash: ${simulatedHash}\n`;
      }
      return result;
    };

    // Handle different trie types
    if (selectedTrie === "Merkle Patricia Trie") {
      const output = Object.entries(data)
        .map(([key, value]) => formatKey(key, value))
        .join("");
      return `${selectedTrie}:\n${output}`;
    } else if (selectedTrie === "Storage Trie") {
      return Object.entries(data)
        .map(([key, value]) => `Storage: ${key} => ${value}\n`)
        .join("");
    } else if (selectedTrie === "Transaction Trie") {
      return Object.entries(data)
        .map(([key, value]) => `Transaction ID: ${key} => ${JSON.stringify(value)}\n`)
        .join("");
    } else if (selectedTrie === "Receipt Trie") {
      return Object.entries(data)
        .map(([key, value]) => `Receipt ID: ${key} => ${JSON.stringify(value)}\n`)
        .join("");
    }
    return ""; // Default fallback
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Trie Visualizer</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1, marginRight: "20px", border: "1px solid black", height: "600px" }}>
          {isGraphView ? (
            <ReactFlow nodes={nodes} edges={edges} style={{ width: "100%", height: "100%" }}>
              <Controls />
            </ReactFlow>
          ) : (
            <textarea
              readOnly
              value={getTextVisualization()}
              style={{ width: "100%", height: "100%", padding: "10px" }}
            />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <label>Selected Trie:</label>
          <select value={selectedTrie} onChange={(e) => setSelectedTrie(e.target.value)}>
            <option>Merkle Patricia Trie</option>
            <option>Storage Trie</option>
            <option>Transaction Trie</option>
            <option>Receipt Trie</option>
          </select>
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              style={{ marginBottom: "10px", padding: "5px" }}
            />
            <input
              type="text"
              placeholder="Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ marginBottom: "10px", padding: "5px" }}
            />
          </div>
          <button onClick={handleInsert} style={{ marginRight: "10px" }}>
            Insert
          </button>
          <button onClick={handleDelete} style={{ marginRight: "10px" }}>
            Delete
          </button>
          <button onClick={handleModify}>Modify</button>
          <button onClick={() => setIsGraphView(!isGraphView)} style={{ marginTop: "20px" }}>
            Toggle Graph/Text View
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrieVisualizer;
