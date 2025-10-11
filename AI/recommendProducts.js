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
  `

  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const rawText = response.choices[0].message.content;
  try {
    return JSON.parse(rawText);
  } catch (err) {
    console.error("Invalid AI JSON:", rawText);
    throw new Error("AI returned invalid JSON");
  }
}


// Function Exports.
module.exports = {  recommendProducts };