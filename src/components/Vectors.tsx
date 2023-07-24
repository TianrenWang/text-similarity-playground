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
  const [vectors, setVectors] = useState<ScoredVector[]>();

  return (
    <div className="margin-10">
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
          }/api/similar_texts?text="${searchText}"&topk=${10}`;
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
