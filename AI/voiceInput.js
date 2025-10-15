const Groq = require("groq-sdk");

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
    model: "qwen/qwen3-32b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const rawText = response.choices[0].message.content;

  // Extract JSON block using regex
  const match = rawText.match(/\{[\s\S]*?\}/);
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

module.exports = { voiceInput };