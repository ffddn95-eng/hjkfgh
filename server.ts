import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/analyzeIdea", async (req, res) => {
    try {
      const { ideaText, userId } = req.body;
      const mistralKey = process.env.MISTRAL_APIKEY;

      if (!mistralKey) {
        throw new Error("MISTRAL_APIKEY is not configured in environment variables.");
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
        throw new Error(`Mistral API Error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      
      let aiResponse;
      try {
        let content = data.choices[0].message.content;
        // Strip markdown if present
        content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        aiResponse = JSON.parse(content);
      } catch (parseError: any) {
        throw new Error(`Failed to parse AI response: ${parseError.message}. Response was: ${data.choices[0].message.content}`);
      }
      
      res.json(aiResponse);

    } catch (e: any) {
      console.error("Analysis Error:", e);
      res.status(500).json({ error: e.message || "Something went wrong" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
