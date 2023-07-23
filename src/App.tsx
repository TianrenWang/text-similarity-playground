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
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TextField
          sx={textfieldStyle}
          value={openAISecret}
          placeholder="OpenAI Secret"
          onChange={(event) => setOpenAISecret(event.target.value)}
        />
        <TextField
          sx={textfieldStyle}
          value={pineconeAPIKey}
          placeholder="Pinecone API Key"
          onChange={(event) => setPineconeAPIKey(event.target.value)}
        />
        <TextField
          sx={textfieldStyle}
          value={pineconeEnvironment}
          placeholder="Pinecone Environment"
          onChange={(event) => setPineconeEnvironment(event.target.value)}
        />
        <TextField
          sx={textfieldStyle}
          value={pineconeIndex}
          placeholder="Pinecone Index"
          onChange={(event) => setPineconeIndex(event.target.value)}
        />
        <TextField
          sx={textfieldStyle}
          value={namespace}
          placeholder="Namespace"
          onChange={(event) => setNamespace(event.target.value)}
        />
      </Box>
      <Button
        sx={{ width: 200, margin: 1, alignSelf: "center" }}
        variant="outlined"
        onClick={() => {
          window.localStorage.setItem("openAISecret", openAISecret);
          window.localStorage.setItem("pineconeAPIKey", pineconeAPIKey);
          window.localStorage.setItem("pineconeIndex", pineconeIndex);
          window.localStorage.setItem("namespace", namespace);
          window.localStorage.setItem(
            "pineconeEnvironment",
            pineconeEnvironment
          );
          setStartedSession(true);
        }}
        disabled={
          !(
            openAISecret &&
            pineconeAPIKey &&
            pineconeIndex &&
            namespace &&
            pineconeEnvironment
          )
        }
      >
        Start Session
      </Button>
      {startedSession && (
        <Vectors
          openAISecretKey={openAISecret}
          pineconeAPIKey={pineconeAPIKey}
          pineconeIndex={pineconeIndex}
          pineconeNamespace={namespace}
          pineconeEnvironment={pineconeEnvironment}
        />
      )}
    </Box>
  );
}
