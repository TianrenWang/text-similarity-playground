import logo from "./logo.svg";
import { useState } from "react";
import "./App.css";
import { Box, Button, TextField } from "@mui/material";
import Vectors from "./components/Vectors";

const textfieldStyle = { width: 200, margin: 1 };

export default function App() {
  const [openAISecret, setOpenAISecret] = useState(
    window.localStorage.getItem("openAISecret") || ""
  );
  const [pineconeAPIKey, setPineconeAPIKey] = useState(
    window.localStorage.getItem("pineconeAPIKey") || ""
  );
  const [pineconeIndex, setPineconeIndex] = useState(
    window.localStorage.getItem("pineconeIndex") || ""
  );
  const [namespace, setNamespace] = useState(
    window.localStorage.getItem("namespace") || ""
  );
  const [pineconeEnvironment, setPineconeEnvironment] = useState(
    window.localStorage.getItem("pineconeEnvironment") || ""
  );
  const [startedSession, setStartedSession] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Box>
        <Box>Fill out all the fields</Box>
      </Box>
    </div>
  );
}
