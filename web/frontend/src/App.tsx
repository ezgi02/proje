import React, { useEffect, useState } from "react"; // ← React namespace'i lazım
import axios from "axios";

const API = import.meta.env.VITE_API_URL as string;
if (!API) {
  console.error("VITE_API_URL okunamadı");
}

type Sentiment = { label?: string; score?: number | null };
type ApiItem = {
  id: number;
  alias?: string;
  userAlias?: string;
  text: string;
  sentiment?: Sentiment;
  sentimentLabel?: string;
  sentimentScore?: number | null;
  createdAt: string;
};
type Message = {
  id: number;
  alias: string;
  text: string;
  sentiment: Sentiment;
  createdAt: string;
};

export default function App() {
  const [alias, setAlias] = useState<string>("oguz");
  const [text, setText] = useState<string>("");
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function normalize(m: ApiItem): Message {
    return {
      id: m.id,
      alias: m.alias ?? m.userAlias ?? "",
      text: m.text,
      sentiment: m.sentiment ?? { label: m.sentimentLabel, score: m.sentimentScore },
      createdAt: m.createdAt,
    };
  }

 /* async function fetchList() {
    try {
      setErr("");
      const { data } = await axios.get<ApiItem[]>(
        `${API}/api/messages?alias=${encodeURIComponent(alias)}&limit=50`
      );
      setItems(data.map(normalize));
    } catch (e) {
      console.error(e);
      setErr("Liste alınamadı.");
    }
  }*/
    async function fetchList() {
      try {
        setErr("");
        const url = `${API}/api/messages?alias=${encodeURIComponent(alias)}&limit=50`;
        const { data } = await axios.get(url, { validateStatus: s => s < 500 });
        if (typeof data === "string") {
          setErr("API URL yanlış veya JSON dönmüyor. .env ve URL’yi kontrol et.");
          console.error("Unexpected string response from", url, data.slice(0,120));
          return;
        }
        const rows = Array.isArray(data) ? data : [data];
        setItems(rows.map(normalize));
      } catch (e) {
        console.error(e);
        setErr("Liste alınamadı.");
      }
    }

  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, []);

  async function send() {
    if (!text.trim()) return;
    try {
      setLoading(true);
      setErr("");
      const body = { alias, text };
      const { data } = await axios.post<ApiItem>(`${API}/api/messages`, body, {
        headers: { "Content-Type": "application/json" },
      });
      setItems((prev) => [normalize(data), ...prev]);
      setText("");
    } catch (e) {
      console.error(e);
      setErr("Gönderilemedi.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  function sentimentColor(label?: string) {
    if (label === "positive") return "green";
    if (label === "negative") return "crimson";
    return "#555";
  }

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>Chat + Duygu Analizi</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={alias}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlias(e.target.value)}
          placeholder="rumuz"
          style={{ flex: "0 0 140px", padding: 8, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <input
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          placeholder="mesaj"
          onKeyDown={onKeyDown}
          style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}
        >
          {loading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={fetchList}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer" }}
        >
          Yenile
        </button>
        {err && <span style={{ color: "crimson" }}>{err}</span>}
      </div>

      {items.map((m) => (
        <div key={m.id} style={{ padding: 10, border: "1px solid #eee", borderRadius: 10, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <strong>@{m.alias}</strong>
            <span style={{ color: sentimentColor(m.sentiment.label) }}>
              {m.sentiment.label ?? "-"}{" "}
              {m.sentiment.score != null ? `(${Number(m.sentiment.score).toFixed(2)})` : ""}
            </span>
          </div>
          <div>{m.text}</div>
        </div>
      ))}

      {items.length === 0 && <div style={{ color: "#666" }}>Henüz mesaj yok. Bir şey yazıp Gönder’e bas.</div>}
    </div>
  );
}
