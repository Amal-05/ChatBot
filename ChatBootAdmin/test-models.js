const { GoogleGenerativeAI } = require("@google/generative-ai");
const gemini_api_key = "AIzaSyDX-ZlUY-ISO6dBysdYsEZtEUs4K7LXxGI";
const googleAI = new GoogleGenerativeAI(gemini_api_key);

async function run() {
  try {
    const geminiModel = googleAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const result = await geminiModel.generateContent("Hello");
    console.log(result.response.text());
  } catch(e) {
    console.error("1.5-flash failed:", e.message);
    try {
      const geminiModel = googleAI.getGenerativeModel({
        model: "gemini-pro",
      });
      const result = await geminiModel.generateContent("Hello");
      console.log(result.response.text());
    } catch(e2) {
      console.error("pro failed:", e2.message);
    }
  }
}
run();
