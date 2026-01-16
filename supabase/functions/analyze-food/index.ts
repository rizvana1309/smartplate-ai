import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are an expert nutritionist AI that analyzes food images. When given a food image, you must:

1. Identify the food item accurately
2. Categorize it as "healthy", "moderate", or "unhealthy"
3. Estimate the nutritional values per typical serving

IMPORTANT: You MUST respond with valid JSON only, no additional text. Use this exact format:
{
  "name": "Food Name",
  "category": "healthy|moderate|unhealthy",
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbohydrates": number,
    "fat": number
  },
  "servingSize": "description of serving (e.g., '1 bowl (350g)')",
  "confidence": number between 0 and 1
}

Classification guidelines:
- healthy: Low calorie, high nutrients, whole foods, vegetables, lean proteins, fruits
- moderate: Mixed nutritional value, processed but not excessive, can be part of balanced diet
- unhealthy: High calories, high fat/sugar, heavily processed, fast food, deep fried

Always provide realistic nutritional estimates based on standard serving sizes.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Clean the base64 string if it has a data URL prefix
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this food image and provide the nutritional information in the exact JSON format specified. Be accurate with your calorie and macro estimates."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response from the AI
    // Clean up any markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.slice(7);
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith("```")) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();

    const foodAnalysis = JSON.parse(cleanContent);

    // Validate the response structure
    if (!foodAnalysis.name || !foodAnalysis.category || !foodAnalysis.nutrition) {
      throw new Error("Invalid AI response structure");
    }

    return new Response(
      JSON.stringify(foodAnalysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-food function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to analyze food image",
        details: "Please try again with a clearer food image"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
