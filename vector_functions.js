const { Configuration, OpenAIApi } = require("openai");
const { PineconeClient } = require("@pinecone-database/pinecone");
const crypto = require("crypto");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});
const openAIAPI = new OpenAIApi(configuration);

const pinecone = new PineconeClient();
pinecone.init({
  environment: process.env.PINECONE_ENVIRONMENT,
  apiKey: process.env.PINECONE_API_KEY,
});

async function getOpenAIEmbedding(text) {
  return (
    await openAIAPI.createEmbedding({
      model: "text-embedding-ada-002",
      input: text,
    })
  ).data.data[0].embedding;
}

exports.getSimilarVectors = async (text, topk, namespace) => {
  console.log(
    `Fetching top ${topk} texts in namespace ${
      namespace || process.env.PINECONE_NAMESPACE
    }`
  );
  const index = pinecone.Index(process.env.PINECONE_INDEX);
  const vector = await getOpenAIEmbedding(text);
  const queryRequest = {
    vector: vector,
    topK: topk,
    includeMetadata: true,
    namespace: namespace || process.env.PINECONE_NAMESPACE,
  };
  return (await index.query({ queryRequest })).matches;
};

exports.indexMessage = async (text, namespace) => {
  const index = pinecone.Index("sophists");
  const vector = await getOpenAIEmbedding(text);
  const actualNamespace = namespace || process.env.PINECONE_NAMESPACE;
  console.log(`Indexing text ${text} in namespace ${actualNamespace}`);

  // This section verifies whether the new message to be indexed already exists
  // in the index.
  const queryRequest = {
    vector: vector,
    topK: 1,
    namespace: actualNamespace,
  };
  const queryResponse = await index.query({ queryRequest });
  if (queryResponse.matches[0]?.score > 0.98) {
    return;
  }

  console.log("Proceeding with indexing.");

  // If it isn't a duplicate, continue with indexing
  const upsertRequest = {
    vectors: [
      {
        id: crypto.randomBytes(20).toString("hex"),
        values: vector,
        metadata: {
          isAIMessage: false,
          createdAt: new Date().toISOString(),
          text: text,
          userId: "No ID",
          username: "Manually Inserted",
        },
      },
    ],
    namespace: actualNamespace,
  };
  await index.upsert({ upsertRequest });
};
