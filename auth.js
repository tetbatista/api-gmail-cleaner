import fs from "fs";
import readline from "readline";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];
const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));
const { client_secret, client_id, redirect_uris } = CREDENTIALS.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("👉 Autoriza esse app acessando a URL:");
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nCola aqui o código que aparecer depois do login: ", async (code) => {
  const { tokens } = await oAuth2Client.getToken(code);
  fs.writeFileSync("token.json", JSON.stringify(tokens));
  console.log("✅ Token salvo em token.json, pronto pra usar!");
  rl.close();
});
