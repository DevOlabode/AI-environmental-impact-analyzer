const Groq = require("groq-sdk");

const compareProducts = async (productA, productB) => {
  const groq = new Groq({ apiKey: process.env.GROQ_KEY });
    const prompt = `
You are an AI that compares two products based on their environmental and material impact.

You must return your entire response strictly as raw JSON text — not in markdown code blocks, not surrounded by triple backticks, and with no commentary.
Do not include any explanations, markdown, or extra text — only valid JSON.

Compare the two products using these criteria:
1. Material impact (sustainability, recyclability, biodegradability)
2. Carbon footprint and manufacturing impact
3. Water and energy usage during production
4. Packaging and shipping footprint
5. Brand sustainability record
6. Overall eco-friendliness score (1–10)
7. Which product is the better eco-choice and why

Return exactly in this JSON structure:

{
  "comparisonSummary": "A concise overview of how both products compare in general.",
  "productA": {
    "name": "string",
    "ecoScore": number,
    "strengths": ["string"],
    "weaknesses": ["string"]
  },
  "productB": {
    "name": "string",
    "ecoScore": number,
    "strengths": ["string"],
    "weaknesses": ["string"]
  },
  "verdict": {
    "betterProduct": "string",
    "reason": "string"
  }
}

Product A details:
${JSON.stringify(productA, null, 2)}

Product B details:
${JSON.stringify(productB, null, 2)}
`;

  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const rawText = response.choices[0].message.content;

  // Clean the response: remove markdown code blocks if present
  let cleanedText = rawText.trim();
  const jsonMatch = cleanedText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch) {
    cleanedText = jsonMatch[1];
  }

  try {
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error("Invalid AI JSON:", rawText);
    throw new Error("AI returned invalid JSON");
  }
};

module.exports = { compareProducts };