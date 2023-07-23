import { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import {
  ScoredVector,
  VectorOperationsApi,
} from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

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

export default function Vectors(props: Props) {
  const [pineconeIndex, setPineconeIndex] = useState<VectorOperationsApi>();
  const [openAIAPI, setOpenAIAPI] = useState<OpenAIApi>();
  const [pineconeError, setPineconeError] = useState("");
  const [openAIError, setOpenAIError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [vectors, setVectors] = useState<ScoredVector[]>();

  useEffect(() => {
    const configuration = new Configuration({
      apiKey: props.openAISecretKey,
    });
    const openAIAPI = new OpenAIApi(configuration);
    setOpenAIAPI(openAIAPI);
    openAIAPI
      .createEmbedding({
        model: "text-embedding-ada-002",
        input: "Test",
      })
      .catch((error) => {
        setOpenAIError(error.toString());
      });

    const pinecone = new PineconeClient();
    pinecone
      .init({
        environment: props.pineconeEnvironment,
        apiKey: props.pineconeAPIKey,
      })
      .then(() => {
        setPineconeIndex(pinecone.Index(props.pineconeIndex));
      })
      .catch((error) => {
        setPineconeError(error.toString());
      });
  }, []);
  if (pineconeError)
    return (
      <div className="margin-10">
        Pinecone failed to initialize: {pineconeError}.
      </div>
    );
  else if (openAIError)
    return (
      <div className="margin-10">
        OpenAI failed to initialize: {openAIError}.
      </div>
    );
  else if (!(pineconeIndex && openAIAPI))
    return <div className="margin-10">Loading your session....</div>;

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
          const textEmbedding = (
            await openAIAPI.createEmbedding({
              model: "text-embedding-ada-002",
              input: searchText,
            })
          ).data.data[0].embedding;
          const queryRequest = {
            vector: textEmbedding,
            topK: 5,
            includeMetadata: true,
            namespace: props.pineconeNamespace,
          };
          const queryResponse = await pineconeIndex.query({ queryRequest });
          setVectors(queryResponse.matches);
        }}
      >
        Search
      </button>
      {vectors &&
        vectors.map((vector) => {
          if (vector.metadata)
            return (
              <>
                <p>{(vector.metadata as Metadata).text}</p>
                <p>{vector.score}</p>
              </>
            );
        })}
    </div>
  );
}
