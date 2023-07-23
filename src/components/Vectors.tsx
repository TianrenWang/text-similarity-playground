import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { Configuration, OpenAIApi } from "openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import {
  ScoredVector,
  VectorOperationsApi,
} from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";
import SearchIcon from "@mui/icons-material/Search";

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

const commonBoxStyle = {
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
    return <Box>Pinecone failed to initialize: {pineconeError}.</Box>;
  else if (openAIError)
    return <Box>OpenAI failed to initialize: {openAIError}.</Box>;
  else if (!(pineconeIndex && openAIAPI))
    return (
      <Box sx={commonBoxStyle}>
        <CircularProgress />
        Loading your session....
      </Box>
    );

  return (
    <Box sx={commonBoxStyle}>
      <TextField
        sx={{ margin: 2, width: "50%" }}
        value={searchText}
        placeholder="Enter the text that you want to find other similar texts for"
        multiline
        minRows={1}
        maxRows={10}
        onChange={(event) => setSearchText(event.target.value)}
      />
      <Button
        variant="outlined"
        startIcon={<SearchIcon />}
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
      </Button>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {vectors &&
          vectors.map((vector) => {
            if (vector.metadata)
              return (
                <ListItem>
                  <ListItemText
                    primary={(vector.metadata as Metadata).text}
                    secondary={vector.score}
                  />
                </ListItem>
              );
          })}
      </List>
    </Box>
  );
}
