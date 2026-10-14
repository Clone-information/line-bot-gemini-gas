# LINE Bot × Gemini API × Google Apps Script

用 Google Apps Script（GAS）串接 LINE Messaging API 與 Gemini API 的 AI 行程助理。
不必架伺服器：資料存在 Google 試算表，訊息由 Gemini 判斷意圖後寫入或查詢。

完整教學：[Gemini 串接 LINE Bot 教學：用 GAS 免伺服器做 AI 助理](https://clone-info.net/blog/line-bot-development-gemini-api-gas-tutorial/)

> **這是單人使用的範例。** 四張工作表都沒有記錄是哪個使用者，任何加好友的人都查得到全部行程與備忘，也會收到所有人的提醒。官方帳號請勿讓外人加好友；要給多人使用，需改成依 `userId` 分開資料。

## 功能

- 用口語新增行程、待辦、備忘（例如「明天下午三點開會」）
- 查詢今天、明天、本週、本月行程，以 Flex Message 卡片回覆
- 行程前 30 分鐘內推播提醒
- 每日晨報、每週總結

## 檔案

| 檔案 | 用途 |
|---|---|
| `Code.gs` | 進入點 `doPost`、訊息分派、提醒與報表 |
| `GeminiAPI.gs` | 呼叫 Gemini，把訊息轉成 JSON 指令 |
| `Database.gs` | 試算表的讀寫（行事曆、待辦清單、備忘錄、用戶資料） |
| `LineAPI.gs` | 回覆與推播訊息、Flex Message 卡片 |
| `appsscript.json` | 專案設定（時區 Asia/Taipei、V8） |

## 安裝

### 1. 準備金鑰

- LINE：自 2024-09-04 起無法在 Developers Console 直接建立 Messaging API channel。先建立 LINE 官方帳號，在 LINE Official Account Manager「設定」→「Messaging API」啟用，再到 [LINE Developers Console](https://developers.line.biz/console/) 的 Messaging API 分頁發行 **Channel access token**
- 同一分頁把「自動回應訊息」與「加入好友的歡迎訊息」關閉，否則官方帳號的預設回應會再回一次
- Gemini：在 [Google AI Studio](https://aistudio.google.com/apikey) 建立 **API 金鑰**

### 2. 建立試算表與 Apps Script

1. 開一份新的 Google 試算表
2. 選單「擴充功能」→「Apps Script」
3. 建立 4 個檔案，把本 repo 的 `Code.gs`、`GeminiAPI.gs`、`Database.gs`、`LineAPI.gs` 內容分別貼上

### 3. 設定指令碼屬性

Apps Script 左側「專案設定」→「指令碼屬性」，新增：

| 屬性 | 值 |
|---|---|
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE 的 Channel access token |
| `GEMINI_API_KEY` | Gemini API 金鑰 |

金鑰不要寫進程式碼，也不要提交到任何 repo。

同一頁把**時區**設為「(GMT+08:00) 台北」。只貼 4 個 `.gs` 檔不會帶入 `appsscript.json`，提醒與晨報依這個時區計算。

### 4. 建立工作表

在編輯器上方選擇函式 `ensureDataExists` 後按「執行」，依提示授權。
它會建立「行事曆」「待辦清單」「備忘錄」「用戶資料」四張工作表與欄位標題。

### 5. 部署成網路應用程式

「部署」→「新增部署作業」→ 類型選「網路應用程式」：

- 執行身分：我
- 具有存取權的使用者：**所有人**（LINE 伺服器才呼叫得到）

複製部署後的網址（結尾是 `/exec`）。

之後每次修改程式，都要到「部署」→「管理部署作業」→ 編輯 → 版本選「新版本」，`/exec` 才會執行新的程式碼。

### 6. 設定 LINE Webhook

回到 LINE Developers Console 的 Messaging API 分頁：

1. Webhook URL 貼上剛才的網址
2. 開啟「Use webhook」
3. 按「Verify」確認成功

### 7. 設定時間觸發器

提醒與報表要靠觸發器才會自動執行。Apps Script 左側「觸發條件」→「新增觸發條件」：

| 函式 | 事件來源 | 頻率 |
|---|---|---|
| `checkReminders` | 時間驅動 | 每 10 分鐘（提醒行程前 30 分鐘內的行程） |
| `dailyReport` | 時間驅動 | 每天早上，例如 7–8 點 |
| `weeklyReport` | 時間驅動 | 每週一早上 |

## 模型

`GeminiAPI.gs` 開頭的 `GEMINI_MODEL` 預設 `gemini-3.5-flash-lite`。
Google 官方模型頁（2026-10）寫明 2.5 系列只開放給過去用過的帳號，新專案請用 3.5 Flash-Lite 或 3.8 Flash；
模型名稱會更新，以[官方模型頁](https://ai.google.dev/gemini-api/docs/models)為準。費用見[官方價格頁](https://ai.google.dev/gemini-api/docs/pricing)。
改模型後要部署新版本才會生效。免費層的內容可能由 Google 用於改進產品，[官方條款](https://ai.google.dev/gemini-api/terms)提醒不要送出個人或機敏資料。

## 限制

- **無法驗證 LINE 簽章**：LINE 建議用 `X-Line-Signature` 標頭[驗證 webhook 來源](https://developers.line.biz/en/docs/messaging-api/verify-webhook-signature/)，但 Apps Script 的 `doPost(e)` 事件物件不含請求標頭（見[官方說明](https://developers.google.com/apps-script/guides/web)），所以這個範例沒有簽章驗證。部署網址請勿公開；正式商用建議改用能讀取標頭的伺服器或 Cloudflare Workers。
- **Apps Script 配額**：執行時間與 URL Fetch 次數有每日上限，見[官方配額表](https://developers.google.com/apps-script/guides/services/quotas)。
- **所有好友共用資料**：見本文開頭說明。
- **編號可能重複**：新增時以「最後一列編號 + 1」產生 ID，多人同時寫入可能拿到相同編號。
- **回覆權杖有時限**：LINE 的回覆權杖需在收到事件後[一分鐘內使用](https://developers.line.biz/en/reference/messaging-api/#send-reply-message)；提醒、晨報與週報走推播，會計入官方帳號的[訊息則數](https://developers.line.biz/en/docs/messaging-api/pricing/)。
- 商用情境（多人、身分綁定、權限）的做法見 [LINE 串接系統開發](https://clone-info.net/line-integration/)。

## 授權

[MIT](LICENSE) © 克隆資訊有限公司 Clone Information Ltd.
