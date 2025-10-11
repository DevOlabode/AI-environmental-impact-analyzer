// analyseImpact.js
const Groq = require("groq-sdk");

// Impact estimation based on materials and weight

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

// Main function to analyze product impact

const analyseImpact = async (
  name,
  brand,
  category,
  material,
  weight,
  originCountry,
  price,
  notes
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
- Weight: ${weight || "Unknown"} kg
- Origin Country: ${originCountry || "Unknown"}
- Price : ${price || "Unknown"}
- Notes: ${notes || "None"}

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

// Function to analyze receipt image and extract product details

const analyseReceipt = async (imageBase64) => {
  const groq = new Groq({
    apiKey: process.env.GROQ_KEY,
  });

  const prompt = `
You are an AI that extracts product information from receipt images.

You will be provided with an image of a receipt and based on that image : 

Analyze the provided image of a receipt and extract the following details for the main product(s) listed:
- Name: Product name
- Brand: Brand name if available
- Category: Product category (e.g., electronics, clothing, food)
- Material: Main material (e.g., plastic, metal, cotton),
- Weight: Estimated weight in grams (if not specified, estimate based on category)
- Origin Country: Country of origin (if not specified, make a reasonable assumption based on the store location)
- price: Price in USD/CAD (Based on the receipt currency or the location of the store on the receipt)
- notes : Any additional notes mentioned on the receipt about the product

Guidelines:
- Focus on the information on the receipt image. 

- If any of this isn't available on the reciept, make a reasonable assumption based on the information provided.
- and if you can't make a reasonable assumption, return "Unknown" for that field.

Return strictly in valid JSON format:

{
  "products": [
    {
      "name": "string",
      "brand": "string",
      "category": "string",
      "material": "string",
      "weight": number,
      "originCountry": "string",
      "price": number
    }
  ]
}

If multiple products, list them. If no clear product, return empty array.
Do not include any extra text outside the JSON.
`;

  try {
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      temperature: 0.3,
    });

    const rawText = response.choices[0].message.content;

    // Clean the response: remove markdown code blocks if present
    let cleanedText = rawText.trim();
    const jsonMatch = cleanedText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      cleanedText = jsonMatch[1];
    
    }

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (err) {
      console.error("AI returned invalid JSON:", rawText);
      throw new Error("Invalid AI response format");
    }

    return parsed.products || [];
  } catch (error) {
    console.error("Groq Vision API Error:", error);
    throw new Error("Failed to analyze receipt");
  }
};


// Function to compare two products based on their environmental impact
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
module.exports = { analyseImpact, analyseReceipt, compareProducts, voiceInput, recommendProducts };