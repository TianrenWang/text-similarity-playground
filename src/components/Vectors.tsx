import { useState } from "react";
import { ScoredVector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

import "../App.css";

interface Metadata {
  text: string;
  createdAt: number;
}

interface Props {
  openAISecretKey: string;
  pineconeAPIKey: string;
  pineconeEnvironment: string;
  pineconeIndex: string;
  pineconeNamespace: string;
}

const commondivStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: 2,
};

export default function Vectors() {
  const [searchText, setSearchText] = useState("");
  const [indexText, setIndexText] = useState("");
  const [namespace, setNamespace] = useState("");
  const [vectors, setVectors] = useState<ScoredVector[]>();

  return (
    <div className="margin-10">
      <div className="margin-bottom">
        <input
          value={namespace}
          placeholder="namespace"
          onChange={(event) => setNamespace(event.target.value)}
        />
      </div>
      <div>
        <textarea
          value={indexText}
          placeholder="Enter the text that you want to index"
          onChange={(event) => setIndexText(event.target.value)}
        />
      </div>
      <button
        className="margin-bottom"
        onClick={async () => {
          const requestURL = `${process.env.REACT_APP_DOMAIN}/api/text?namespace=${namespace}`;
          fetch(requestURL, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: indexText }),
          })
            .then((response) => {
              return response.json();
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        Index
      </button>
      <div>
        <textarea
          value={searchText}
          placeholder="Enter the text that you want to find other similar texts for"
          onChange={(event) => setSearchText(event.target.value)}
        />
      </div>
      <button
        onClick={async () => {
          const requestURL = `${
            process.env.REACT_APP_DOMAIN
          }/api/similar_texts?text="${searchText}"&topk=${10}&namespace=${namespace}`;
          fetch(requestURL)
            .then((response) => {
              return response.json();
            })
            .then((vectors) => {
              setVectors(vectors);
            });
        }}
      >
        Search
      </button>
      {vectors &&
        vectors.map((vector) => {
          if (vector.metadata)
            return (
              <>
                <p>
                  {(vector.metadata as Metadata).text ||
                    "This vector doesn't have an associated text"}
                </p>
                <p>{vector.score}</p>
              </>
            );
        })}
    </div>
  );
}
