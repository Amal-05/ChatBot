const API_KEY = "AIzaSyA4KNYhKB9ohuw19vjVQu6inu9IpbsmgpA";

async function listModels() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch failed", err);
  }
}

listModels();
