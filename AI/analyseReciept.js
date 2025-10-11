const Groq = require("groq-sdk");

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

:

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

    return Array.isArray(parsed) ? parsed : parsed.products || [];
  } catch (error) {
    console.error("Groq Vision API Error:", error);
    throw new Error("Failed to analyze receipt");
  }
};

module.exports = { analyseReceipt };