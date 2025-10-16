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

Return exactly in this JSON structure (nothing extra — no notes, no markdown):

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
    model: "qwen/qwen3-32b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const rawText = response.choices[0].message.content;
  let cleanedText = rawText.trim();

  // ✅ Extract ONLY the JSON object
  const jsonOnly = cleanedText.match(/\{[\s\S]*\}/);
  if (!jsonOnly) {
    console.error("No JSON object detected in AI response:", rawText);
    throw new Error("AI did not return valid JSON");
  }

  cleanedText = jsonOnly[0];

  try {
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error("Invalid JSON after extraction:", cleanedText);
    throw new Error("AI returned invalid JSON");
  }
};

module.exports = { compareProducts };
