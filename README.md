
# Gmail Cleaner 🚀

Um script/API em Node.js para limpar rapidamente emails do Gmail, movendo-os para a lixeira com filtros personalizados. Ideal para organizar contas cheias de spam, promoções ou newsletters indesejadas.

---

## Funcionalidades

- Movimentar emails para a lixeira via query do Gmail.
- Suporta filtros combinados, por exemplo:
  - `from:shein.com`
  - `is:unread`
  - `is:unread from:shein.com`
  - `before:2024/01/01 from:shein.com`
- Paginamento automático para processar grandes volumes de emails.
- Pode ser usado via script ou como uma API local com endpoints REST.

---

## Pré-requisitos

- Node.js >= 18
- Conta Google com Gmail
- Projeto OAuth 2.0 criado no Google Cloud

---

## Configuração

1. Clone o projeto:

```bash
git clone https://github.com/tetbatista/api-gmail-cleaner.git
cd gmail-cleaner
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um OAuth Client no [Google Cloud Console](https://console.cloud.google.com/):

- Tipo: **Web**
- Redirect URI: `http://localhost:3000`
- Baixe o JSON e renomeie para `credentials.json`.
- Adicione seu email como **test user** na tela de consentimento OAuth.

4. Gere o token:

```bash
npm run auth
# ou
node .\auth.js
```

- Abra a URL gerada no navegador.
- Faça login na conta Google desejada.
- Copie o `code` da URL e cole no terminal.
- O `token.json` será criado automaticamente.

---

## Uso

### Como script

No `auth.js` ou outro script, você pode chamar a função:

```js
await moveToTrash("is:unread from:shein.com");
```

### Como API

Rode o servidor:

```bash
npm start
```

Acesse via navegador ou Postman:

```
GET http://localhost:3000/clean?q=is:unread from:shein.com
```

Exemplo de retorno:

```json
{
  "message": "230 emails enviados pra lixeira com sucesso.",
  "query": "is:unread from:shein.com"
}
```

---

## Observações

- Certifique-se que os emails existem na conta associada ao token.
- A query do Gmail deve seguir a mesma sintaxe da busca no Gmail.
- Máximo de emails por chamada: 500 (o script faz paginação automática).

---

## Tecnologias

- Node.js
- Express
- Google Gmail API (`googleapis`)
