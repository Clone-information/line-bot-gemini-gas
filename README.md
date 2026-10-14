# LINE Bot × Gemini API × Google Apps Script

用 Google Apps Script（GAS）串接 LINE Messaging API 與 Gemini API 的 AI 行程助理。
不必架伺服器：資料存在 Google 試算表，訊息由 Gemini 判斷意圖後寫入或查詢。

完整教學（含各步驟截圖）：[LINE Bot 開發教學：用 Gemini API 與 GAS 打造 AI 助理](https://clone-info.net/blog/line-bot-development-gemini-api-gas-tutorial/)

## 功能

- 用口語新增行程、待辦、備忘（例如「明天下午三點開會」）
- 查詢今天、明天、本週、本月行程，以 Flex Message 卡片回覆
- 行程前 30 分鐘推播提醒
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

- LINE：在 [LINE Developers Console](https://developers.line.biz/console/) 建立 Messaging API channel，取得 **Channel access token**
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

### 4. 建立工作表

在編輯器上方選擇函式 `ensureDataExists` 後按「執行」，依提示授權。
它會建立「行事曆」「待辦清單」「備忘錄」「用戶資料」四張工作表與欄位標題。

### 5. 部署成網路應用程式

「部署」→「新增部署作業」→ 類型選「網路應用程式」：

- 執行身分：我
- 具有存取權的使用者：**所有人**（LINE 伺服器才呼叫得到）

複製部署後的網址（結尾是 `/exec`）。

### 6. 設定 LINE Webhook

回到 LINE Developers Console 的 Messaging API 分頁：

1. Webhook URL 貼上剛才的網址
2. 開啟「Use webhook」
3. 按「Verify」確認成功

### 7. 設定時間觸發器

提醒與報表要靠觸發器才會自動執行。Apps Script 左側「觸發條件」→「新增觸發條件」：

| 函式 | 事件來源 | 頻率 |
|---|---|---|
| `checkReminders` | 時間驅動 | 每 10 分鐘（提醒視窗是行程前 30 分鐘） |
| `dailyReport` | 時間驅動 | 每天早上，例如 7–8 點 |
| `weeklyReport` | 時間驅動 | 每週一早上 |

## 模型

`GeminiAPI.gs` 開頭的 `GEMINI_MODEL` 預設 `gemini-3.5-flash-lite`。
Google 官方模型頁（2026-10）寫明 2.5 系列只開放給過去用過的帳號，新專案請用 3.5 Flash-Lite 或 3.8 Flash；
模型名稱會更新，以[官方模型頁](https://ai.google.dev/gemini-api/docs/models)為準。費用見[官方價格頁](https://ai.google.dev/gemini-api/docs/pricing)。

## 限制

- **無法驗證 LINE 簽章**：LINE 建議用 `X-Line-Signature` 標頭[驗證 webhook 來源](https://developers.line.biz/en/docs/messaging-api/verify-webhook-signature/)，但 Apps Script 的 `doPost(e)` 事件物件不含請求標頭（見[官方說明](https://developers.google.com/apps-script/guides/web)），所以這個範例沒有簽章驗證。部署網址請勿公開；正式商用建議改用能讀取標頭的伺服器或 Cloudflare Workers。
- **Apps Script 配額**：執行時間與 URL Fetch 次數有每日上限，見[官方配額表](https://developers.google.com/apps-script/guides/services/quotas)。
- 這是個人與小團隊用的教學範例，多人同時使用、資料量大時，試算表會變慢。

## 授權

[MIT](LICENSE) © 克隆資訊有限公司 Clone Information Co., Ltd.
