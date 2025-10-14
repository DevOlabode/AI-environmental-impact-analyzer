const Groq = require("groq-sdk");

const recommendProducts = async (category, material, price, sustainabilityScore) => {
  const groq = new Groq({ apiKey: process.env.GROQ_KEY });

  const prompt = `
You are an AI sustainability assistant. Based on the product details below, suggest 3 alternative products that are more environmentally friendly.

Each alternative should:
- Belong to the same general category
- Use more sustainable materials OR have a lower environmental impact
- Be realistic and commonly available in the market

For each alternative, return the response in this exact JSON format without any extra text or formatting:
Make the result strictly JSON. NO extra text or explanations outside the JSON.
[
  {
    "name": "Alternative Product Name",
    "material": "Material used",
    "why_better": "One-sentence reason why it is more eco-friendly"
  }
]

Here are the details of the original product:
Category: ${category}
Material: ${material}
price: ${price}
Sustainability Score: ${sustainabilityScore}
  `;

  const response = await groq.chat.completions.create({
    model: "qwen/qwen3-32b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const rawText = response.choices[0].message.content;

  // Extract JSON block using regex
  const match = rawText.match(/\[\s*{[\s\S]*?}\s*\]/);
  if (!match) {
    console.error("Invalid AI JSON:", rawText);
    throw new Error("AI returned invalid JSON");
  }

  try {
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("JSON parsing failed:", match[0]);
    throw new Error("AI returned malformed JSON");
  }
};

module.exports = { recommendProducts };