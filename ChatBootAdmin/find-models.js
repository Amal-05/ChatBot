const API_KEY = "AIzaSyA4KNYhKB9ohuw19vjVQu6inu9IpbsmgpA";

async function findFlash() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
  const data = await res.json();
  const names = data.models.map(m => m.name);
  console.log("Flash models:", names.filter(n => n.includes("flash")));
  console.log("Pro models:", names.filter(n => n.includes("pro")));
}
findFlash();
