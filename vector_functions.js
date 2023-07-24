const { Configuration, OpenAIApi } = require("openai");
const { PineconeClient } = require("@pinecone-database/pinecone");

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

exports.getSimilarVectors = async (text, topk) => {
  const index = pinecone.Index(process.env.PINECONE_INDEX);
  const vector = await getOpenAIEmbedding(text);
  const queryRequest = {
    vector: vector,
    topK: topk,
    includeMetadata: true,
    namespace: process.env.PINECONE_NAMESPACE,
  };
  return (await index.query({ queryRequest })).matches;
};
