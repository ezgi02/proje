
- Web (Vercel): https://frontend-f4wdwuade-kayabeliz95-8865s-projects.vercel.app
- API (Render, Swagger): https://backendapi-yowq.onrender.com/swagger
- AI (Hugging Face Space): https://beliz12-sentiment-tr.hf.space  (REST: /api/predict/)

- Canlı:
• Web (Vercel – Preview): https://frontend-f4wdwuade-kayabeliz95-8865s-projects.vercel.app
• API (Render + Swagger): https://backendapi-yowq.onrender.com/swagger
• AI Servisi (Hugging Face Space):
  - UI:  https://beliz12-sentiment-tr.hf.space
  - REST: https://beliz12-sentiment-tr.hf.space/api/predict/

Öne çıkanlar:
• Backend: ASP.NET Core 8, EF Core, SQLite; `POST /api/messages`, `GET /api/messages`; Health: `/health`
• AI entegrasyonu: HF Space (Gradio + transformers, çok dilli sentiment), `AI_URL` üzerinden otomatik analiz
• Web: React + Vite + TS, Axios; alias filtreleme, anında listeleme
• Mobil: Expo React Native, AsyncStorage ile alias; pull-to-refresh, duygu rengine göre gösterim
• CORS: Web domain’ine izinli; Swagger ile hızlı test

Hızlı test:
1) Swagger → `POST /api/messages`
   Örnek gövde:
   { "alias": "ezgi", "text": "bugün harikayım" }
2) Yanıtta `sentimentLabel` ve `sentimentScore` alanları dönmektedir.
