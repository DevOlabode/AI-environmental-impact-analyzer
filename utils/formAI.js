const Groq = require('groq-sdk');
const expressError = require('../utils/expressError');

const analyseImpact = async (name, brand, category, material, weight, originCountry)=>{
const groq = new Groq({
    apiKey: process.env.GROQ_KEY, 
});
// const prompt = `
// You are an Environmental Impact Analyzer AI.

// Given the following product details:
// - Name: ${name || "Unknown"}
// - Brand: ${brand || "Unknown"}
// - Category: ${category || "Unknown"}
// - Material: ${material || "Unknown"}
// - Weight: ${weight || "Unknown"} grams
// - Origin Country: ${originCountry || "Unknown"}

// Analyze the product's potential environmental impact and return the result strictly in JSON format with the following structure:

// {
//   "carbonFootprint": <number in kg CO2>,
//   "waterUsage": <number in liters>,
//   "recyclability": "<Low | Medium | High>",
//   "sustainabilityScore": <integer 1-10>,
//   "aiExplanation": "<1-2 sentence explanation of reasoning>"
// }

// Rules:
// - Always return valid JSON only, with no extra text.
// - If data is missing (e.g., weight not provided), make a reasonable assumption and note it in aiExplanation.
// - sustainabilityScore should balance carbon footprint, water usage, and recyclability.
// - aiExplanation should be short, clear, and understandable for non-experts.
//   `;

const prompt = `
You are an Environmental Impact Analyzer AI.

Your task is to assess the environmental impact of a product based on its attributes. Use realistic assumptions and vary your analysis based on the product's material, weight, category, and origin country.

Here are the product details:
- Name: ${name}
- Brand: ${brand}
- Category: ${category}
- Material: ${material}
- Weight: ${weight} grams
- Origin Country: ${originCountry}

Return your analysis strictly in **valid JSON format** with the following structure:

{
  "carbonFootprint": <number in kg CO2>,
  "waterUsage": <number in liters>,
  "recyclability": "<Low | Medium | High>",
  "sustainabilityScore": <integer 1-10>,
  "aiExplanation": "<1-2 sentence explanation of reasoning>"
}

Guidelines:
- Adjust carbonFootprint and waterUsage based on material, weight, and originCountry.
- Use realistic estimates for different categories (e.g., electronics, clothing, food).
- If any data is missing, make a reasonable assumption and mention it in aiExplanation.
- Recyclability should reflect the material's typical recycling potential.
- SustainabilityScore should balance carbon footprint, water usage, and recyclability.
- aiExplanation must be short, clear, and tailored to the specific product.
- Avoid repeating the same sentence structure or phrasing across different analyses.
- Do not include any extra text outside the JSON block.
`
  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b", 
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

      const rawText = response.choices[0].message.content.trim();

    // Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("AI returned invalid JSON:", rawText);
      throw new Error("Invalid AI response format");
    }

    return parsed;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Failed to analyze product impact");
  }
}

module.exports = { analyseImpact };