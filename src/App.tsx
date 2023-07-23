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
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
        Fill out all the fields
      </Box>
    </Box>
  );
}
