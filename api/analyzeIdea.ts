export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { ideaText, userId } = req.body;
    const mistralKey = process.env.MISTRAL_APIKEY;

    if (!mistralKey) {
      return res.status(500).json({ error: "MISTRAL_APIKEY is not configured in environment variables." });
    }

    if (!ideaText || typeof ideaText !== "string") {
      return res.status(400).json({ error: "No idea provided." });
    }

    const systemPrompt = `You are a ruthless startup validation engine.
The user provides an idea, and you judge it brutally, then provide a 7-day validation plan.
Return ONLY valid JSON.

Schema:
{
  "idea": { "rawInput": "string", "refinedOneLiner": "string", "category": "string", "targetCustomer": "string" },
  "ruthlessVerdict": { "score": number, "verdict": "kill|pivot|validate_more|build", "summary": "string", "brutalTruth": "string" },
  "scores": { "marketDemand": number, "willingnessToPay": number, "executionFeasibility": number, "differentiation": number, "distribution": number, "firstRevenueProbability": number },
  "fatalRisks": [{ "title": "string", "explanation": "string", "severity": "low|medium|high" }],
  "hooks": [{ "name": "string", "psychologicalPrinciple": "string", "implementation": "string" }],
  "executionPlan": [{
    "id": "string", "day": number, "title": "string", "objective": "string",
    "targetSite": { "name": "string", "url": "string" },
    "estimatedMinutes": number, "steps": ["string"], "searchQueries": ["string"],
    "copyTexts": [{ "label": "string", "text": "string" }],
    "successCriteria": ["string"], "failureSignals": ["string"],
    "requiredInputs": [{ "key": "string", "label": "string", "type": "text|number|url|boolean", "required": boolean }],
    "status": "locked|todo|in_progress|completed|failed"
  }],
  "pivots": [{ "id": "string", "title": "string", "reason": "string", "newTargetCustomer": "string", "strongerPainPoint": "string", "monetizationPath": "string", "firstValidationAction": "string", "difficulty": "low|medium|high", "firstRevenuePotential": number }]
}`;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${mistralKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this idea and return JSON: ${ideaText}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ error: `Mistral API Error: ${JSON.stringify(error)}` });
    }

    const data = await response.json();
    
    let aiResponse;
    try {
      let content = data.choices[0].message.content;
      // Strip markdown if present
      content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      aiResponse = JSON.parse(content);
    } catch (parseError) {
      return res.status(500).json({ error: `Failed to parse AI response: ${parseError.message}. Response was: ${data.choices[0].message.content}` });
    }
    
    res.status(200).json(aiResponse);

  } catch (e) {
    console.error("Analysis Error:", e);
    res.status(500).json({ error: e.message || "Something went wrong" });
  }
}
