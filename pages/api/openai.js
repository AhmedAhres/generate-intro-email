const OpenAI = require("openai-api");

export default async (req, res) => {
  let prompt = `Generate a well-written email for ${req.search}. My goal is to work at their research lab at Stanford.`;
  const configuration = new Configuration({
    apiKey: env.local.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const gptResponse = await openai.createCompletion("text-davinci-002", {
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 60,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  });

  res.status(200).json({ text: `${gptResponse.data.choices[0].text}` });
};
