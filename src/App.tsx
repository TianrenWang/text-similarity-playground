import { useState } from "react";
import "./App.css";
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
    <div>
      <div className="margin-10">Text Similarity Playground</div>
      {/* <div>
        <input
          value={openAISecret}
          placeholder="OpenAI Secret"
          onChange={(event) => setOpenAISecret(event.target.value)}
        />
        <input
          value={pineconeAPIKey}
          placeholder="Pinecone API Key"
          onChange={(event) => setPineconeAPIKey(event.target.value)}
        />
        <input
          value={pineconeEnvironment}
          placeholder="Pinecone Environment"
          onChange={(event) => setPineconeEnvironment(event.target.value)}
        />
        <input
          value={pineconeIndex}
          placeholder="Pinecone Index"
          onChange={(event) => setPineconeIndex(event.target.value)}
        />
        <input
          value={namespace}
          placeholder="Namespace"
          onChange={(event) => setNamespace(event.target.value)}
        />
      </div>
      <button
        className="margin-10"
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
      </button>
      {startedSession && (
        <Vectors
          openAISecretKey={openAISecret}
          pineconeAPIKey={pineconeAPIKey}
          pineconeIndex={pineconeIndex}
          pineconeNamespace={namespace}
          pineconeEnvironment={pineconeEnvironment}
        />
      )} */}
      <Vectors />
    </div>
  );
}
