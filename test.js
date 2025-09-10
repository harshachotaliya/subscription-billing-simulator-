import fetch from "node-fetch";

const API_KEY = process.env.GEMINI_API_KEY;

const resp = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDhZTS0wx7t1XCRMLd9cLRxrY71ec2s_9Y`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello Gemini!" }] }]
    })
  }
);

const data = await resp.json();
console.log(data);
