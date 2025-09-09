import express from "express";
import fs from "fs";
import { google } from "googleapis";

const app = express();
const PORT = 3000;

// Carregar credenciais e token
const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));
const TOKEN = JSON.parse(fs.readFileSync("token.json"));

const { client_secret, client_id, redirect_uris } = CREDENTIALS.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(TOKEN);

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

// Função que manda emails pra lixeira
async function moveToTrash(query) {
  let nextPageToken = null;
  let totalDeleted = 0;

  do {
    const res = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 500,
      pageToken: nextPageToken || undefined,
    });

    const messages = res.data.messages || [];
    nextPageToken = res.data.nextPageToken || null;

    if (messages.length > 0) {
      const ids = messages.map((msg) => msg.id);

      await gmail.users.messages.batchModify({
        userId: "me",
        requestBody: {
          ids: ids,
          addLabelIds: ["TRASH"], // joga na lixeira
        },
      });

      totalDeleted += ids.length;
    }
  } while (nextPageToken);

  return totalDeleted;
}

// Endpoint
app.get("/clean", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Falta o parâmetro 'q' (query do Gmail)." });
  }

  try {
    const count = await moveToTrash(query);
    res.json({ message: `${count} emails enviados pra lixeira com sucesso.`, query });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao processar a limpeza.", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
