const FITNESS_PROMPT = (ml) => `
You are a strict fitness nutrition analyst for athletes and actors who track calories obsessively.
The user consumed ${ml}ml of the drink shown on this tetra pack label.

Respond ONLY in this exact JSON format — no markdown, no extra text, no backticks:

{
  "product": "exact product name from label",
  "brand": "brand name",
  "verdict": "GREEN" or "YELLOW" or "RED",
  "calories": <integer: total kcal for ${ml}ml>,
  "sugar_g": <number: grams of sugar for ${ml}ml>,
  "protein_g": <number: grams of protein for ${ml}ml>,
  "fat_g": <number: grams of fat for ${ml}ml>,
  "carbs_g": <number: grams of carbs for ${ml}ml>,
  "summary": "<MAX 20 WORDS: one punchy verdict sentence for a fitness person>",
  "tip": "<MAX 15 WORDS: one actionable fitness tip>",
  "flags_bad": ["list of harmful ingredients found, e.g. Aspartame, HFCS, Sodium Benzoate"],
  "flags_good": ["list of positives, e.g. No preservatives, Natural flavors, Electrolytes"]
}

Verdict rules for ${ml}ml consumed:
GREEN  → calories < 80 AND sugar < 8g AND no artificial sweeteners → great for fitness
YELLOW → calories 80-150 OR sugar 8-15g OR has some additives → consume carefully  
RED    → calories > 150 OR sugar > 15g OR banned WHO additives OR expired → avoid

WHO banned/flagged additives: Sudan dyes, Cyclamate, Trans fats, HFCS, Artificial colors (Red 40, Yellow 5).
Flag as CAUTION: Aspartame, Saccharin, Acesulfame-K, Sodium Benzoate, Carrageenan.

If label is unreadable or image is not a food product, return:
{"product":"Unknown","brand":"","verdict":"RED","calories":0,"sugar_g":0,"protein_g":0,"fat_g":0,"carbs_g":0,"summary":"Cannot read label — avoid this drink to stay safe.","tip":"Photograph the nutrition facts panel clearly.","flags_bad":["Unreadable label"],"flags_good":[]}

Be precise. Scale all values proportionally from the per-100ml figures on the label to ${ml}ml.
`;

export async function analyzeDrink(base64Image, ml) {
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  if (!API_KEY) throw new Error("API key missing");

  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: FITNESS_PROMPT(ml) },
          { inline_data: { mime_type: "image/jpeg", data: base64Image.split(",")[1] } },
          { text: "Analyze this tetra pack label now." }
        ]
      }]
    })
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
