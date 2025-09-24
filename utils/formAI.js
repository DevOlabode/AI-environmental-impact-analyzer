// analyseImpact.js
const Groq = require("groq-sdk");

// Simple baseline estimator for CO₂ & water usage per material
// function estimateImpact(materials, weightGrams) {
//   const weightKg = weightGrams / 1000; // normalize to kg

//   let carbonPerKg = 0;
//   let waterPerKg = 0;

//   const mat = materials;

//   if (mat.includes("plastic") || mat.includes("synthetic")) {
//     carbonPerKg += 2.5;
//     waterPerKg += 40;
//   }
//   if (mat.includes("metal")) {
//     carbonPerKg += 8;
//     waterPerKg += 100;
//   }
//   if (mat.includes("glass")) {
//     carbonPerKg += 1.5;
//     waterPerKg += 20;
//   }
//   if (mat.includes("rubber")) {
//     carbonPerKg += 3;
//     waterPerKg += 60;
//   }
//   if (mat.includes("cotton") || mat.includes("fabric")) {
//     carbonPerKg += 2;
//     waterPerKg += 150;
//   }

//   // Defaults if no material matched
//   if (carbonPerKg === 0) carbonPerKg = 2;
//   if (waterPerKg === 0) waterPerKg = 50;

//   const carbonFootprint = +(carbonPerKg * weightKg).toFixed(2);
//   const waterUsage = +(waterPerKg * weightKg).toFixed(2);

//   return { carbonFootprint, waterUsage };
// }

function estimateImpact(materials, weightGrams) {
  const weightKg = weightGrams / 1000; // normalize to kg

  let carbonPerKg = 0;
  let waterPerKg = 0;

  const mat = (materials || "").toLowerCase(); // <-- fixed

  if (mat.includes("plastic") || mat.includes("synthetic")) {
    carbonPerKg += 2.5;
    waterPerKg += 40;
  }
  if (mat.includes("metal")) {
    carbonPerKg += 8;
    waterPerKg += 100;
  }
  if (mat.includes("glass")) {
    carbonPerKg += 1.5;
    waterPerKg += 20;
  }
  if (mat.includes("rubber")) {
    carbonPerKg += 3;
    waterPerKg += 60;
  }
  if (mat.includes("cotton") || mat.includes("fabric")) {
    carbonPerKg += 2;
    waterPerKg += 150;
  }

  if (carbonPerKg === 0) carbonPerKg = 2;
  if (waterPerKg === 0) waterPerKg = 50;

  const carbonFootprint = +(carbonPerKg * weightKg).toFixed(2);
  const waterUsage = +(waterPerKg * weightKg).toFixed(2);

  return { carbonFootprint, waterUsage };
}

const analyseImpact = async (
  name,
  brand,
  category,
  material,
  weight,
  originCountry
) => {
  
const groq = new Groq({
    apiKey: process.env.GROQ_KEY,
});

  // Step 1: Calculate baseline estimates
  const { carbonFootprint, waterUsage } = estimateImpact(material, weight);

  // Step 2: Create strict prompt
  const prompt = `
You are an Environmental Impact Analyzer AI.

Here are the product details:
- Name: ${name || "Unknown"}
- Brand: ${brand || "Unknown"}
- Category: ${category || "Unknown"}
- Material: ${material || "Unknown"}
- Weight: ${weight || "Unknown"} g
- Origin Country: ${originCountry || "Unknown"}

Baseline estimates (calculated already):
- Carbon Footprint: ${carbonFootprint} kg CO₂
- Water Usage: ${waterUsage} liters

Return your analysis strictly in valid JSON format:

{
  "carbonFootprint": <number in kg CO2>,
  "waterUsage": <number in liters>,
  "recyclability": "<Low | Medium | High>",
  "sustainabilityScore": <integer 1-10>,
  "aiExplanation": "<1-3 sentences that explain reasoning using the provided details. 
  Mention category and originCountry explicitly. 
  If an assumption was made, mention it clearly.>"
}

Rules:
- NEVER contradict provided values (e.g., if originCountry is Germany, do not mention China).
- Start from the baseline estimates; you may adjust slightly but explain why.
- Recyclability depends on the material.
- SustainabilityScore balances carbonFootprint, waterUsage, and recyclability.
- NEVER assume a different weight. Use the weight provided.
- Reference the product's category and originCountry explicitly in your explanation.
- Do not include any extra text outside the JSON.
`;

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // lower temp for more consistency
    });

    const rawText = response.choices[0].message.content;

    // Step 3: Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("AI returned invalid JSON:", rawText);
      throw new Error("Invalid AI response format");
    }

    // Step 4: Validate key fields
    if (
      typeof parsed.carbonFootprint !== "number" ||
      typeof parsed.waterUsage !== "number" ||
      !["Low", "Medium", "High"].includes(parsed.recyclability) ||
      typeof parsed.sustainabilityScore !== "number" ||
      typeof parsed.aiExplanation !== "string"
    ) {
      throw new Error("AI returned malformed analysis");
    }

    return parsed;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Failed to analyze product impact");
  }
};

module.exports = { analyseImpact };
