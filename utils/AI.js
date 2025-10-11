const Groq = require("groq-sdk");


// Function to compare two products based on their environmental impact

const voiceInput = async (transcript) => {
  const groq = new Groq({apiKey: process.env.GROQ_KEY});

  const prompt = `Extract product information from this voice input and return ONLY a valid JSON object with these exact fields:

{
  "name": "product name",
  "brand": "brand name or Unknown",
  "category": "one of: Food, Electronics, Clothing, Beverage, Household, Personal Care, Other",
  "material": "primary material (e.g., Plastic, Metal, Glass, Cotton, Aluminum) or Unknown",
  "weight": "numeric value only in kg (convert if needed, e.g., 500g becomes 0.5)",
  "originCountry": "country name or Unknown",
  "price": "numeric value only (no currency symbols)",
  "notes" : "Additional Notes the User mentioned or None"
}

Rules:
- Return valid JSON only, no extra text or formatting
- Use "Unknown" for any text fields if information is missing
- Use 0 for weight and price if not mentioned
- Extract all available information from the voice input
- If information is not mentioned, use "Unknown" for text fields or 0 for numeric fields
- Convert all weights to kilograms (kg)
- Return ONLY the JSON object, no explanation or markdown formatting
- Category must be exactly one of the listed options

Voice input: "${transcript}"`;

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
};

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
module.exports = { voiceInput, recommendProducts };