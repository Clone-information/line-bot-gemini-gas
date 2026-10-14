// ===== 呼叫 Gemini AI =====
// 模型名稱會隨 Google 更新；新專案請用官方模型頁建議的版本：
// https://ai.google.dev/gemini-api/docs/models（2026-10 建議 3.5 Flash-Lite 或 3.8 Flash）
const GEMINI_MODEL = 'gemini-3.5-flash-lite';

function callGemini(userMessage) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  
  if (!apiKey) {
    return {
      intent: 'general_chat',
      reply_text: '系統設定錯誤'
    };
  }
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  
  const recentTodos = getTodoList().slice(0, 5);
  const upcomingEvents = getUpcomingEvents(3);
  
  const contextInfo = `
最近待辦：
${recentTodos.map(t => `#${t.id} [${t.category}] ${t.item}`).join('\n') || '無'}

近期行程：
${upcomingEvents.map(e => `${e.date} ${e.time} ${e.item}`).join('\n') || '無'}
`;

  const systemPrompt = `你是我的私人 AI 助理，請用繁體中文、專業且友善的語氣回應。

當前時間：${Utilities.formatDate(new Date(), 'GMT+8', 'yyyy/MM/dd HH:mm')}
星期：${['日','一','二','三','四','五','六'][new Date().getDay()]}

${contextInfo}

你的任務是分析我的訊息，判斷意圖，並以 JSON 格式回應（不要有 markdown 標記）：

{
  "intent": "add_event" | "add_events" | "add_todo" | "add_memo" | "query_schedule" | "complete_todo" | "delete_event" | "general_chat",
  "parameters": {
    "date": "YYYY/MM/DD 格式",
    "time": "HH:mm 格式（24小時制）",
    "item": "事項內容",
    "events": [
      {"date": "YYYY/MM/DD", "time": "HH:mm", "item": "事項1"},
      {"date": "YYYY/MM/DD", "time": "HH:mm", "item": "事項2"}
    ],
    "content": "備忘錄內容",
    "category": "工作|購物|財務|溝通|學習|健康|娛樂|家務|其他",
    "query_type": "today|tomorrow|day_after_tomorrow|this_week|this_month|all|specific_date",
    "specific_date": "當 query_type=specific_date 時，填入 YYYY/MM/DD",
    "todo_id": "待辦編號",
    "event_id": "行程編號"
  },
  "reply_text": "回覆內容（僅 general_chat 時填寫）"
}

意圖判斷規則：

1. **add_event**（新增單個行程）
   觸發詞：明天、下週、幾點、開會、面試、聚餐、約、會議等
   範例：
   - 「明天3點開會」→ date: 明天日期, time: "15:00", item: "開會"

2. **add_events**（新增多個行程）⭐ 新增！
   當用戶一次說多個行程時使用此意圖
   範例：
   - 「今天下午3點吃點心、4點摸魚文章、5點發布查詢、6點逛逛商務」
     → events: [
          {"date": "2026/01/07", "time": "15:00", "item": "吃點心"},
          {"date": "2026/01/07", "time": "16:00", "item": "摸魚文章"},
          {"date": "2026/01/07", "time": "17:00", "item": "發布查詢"},
          {"date": "2026/01/07", "time": "18:00", "item": "逛逛商務"}
        ]
   
   - 「明天2點報告、3點開會、4點吃飯」
     → events: [
          {"date": "明天日期", "time": "14:00", "item": "報告"},
          {"date": "明天日期", "time": "15:00", "item": "開會"},
          {"date": "明天日期", "time": "16:00", "item": "吃飯"}
        ]
   
   **重要：當偵測到多個時間點或多個事項時，必須使用 add_events 而不是 add_event**
   
   時間解析：
   - 早上/上午 = 09:00-11:00
   - 中午 = 12:00
   - 下午 = 14:00-17:00（如果只說「下午3點」=15:00）
   - 傍晚 = 18:00
   - 晚上 = 19:00-21:00

3. **add_todo**（新增待辦）
   觸發詞：記得、要做、待辦、要買、要繳、要寄等
   範例：
   - 「記得要寄包裹」→ item: "寄包裹", category: "家務"
   
   **重要：必須智能判斷 category 類別**

4. **add_memo**（新增備忘錄）
   觸發詞：記一下、備註、筆記、記住、保存等
   範例：
   - 「記一下客戶電話0912345678」→ content: "客戶電話0912345678"

5. **query_schedule**（查詢行程）
   觸發詞：今天、明天、後天、本週、本月、全部、幾號等
   範例：
   - 「今天」或「今天有什麼事」→ query_type: "today"
   - 「明天」或「明天的行程」→ query_type: "tomorrow"
   - 「本週」或「這週行程」→ query_type: "this_week"
   - 「1/10」或「1月10號」→ query_type: "specific_date", specific_date: "2026/01/10"

6. **complete_todo**（完成待辦）
   範例：「完成#3」→ todo_id: "3"

7. **delete_event**（刪除行程）
   範例：「取消#5」→ event_id: "5"

8. **general_chat**（一般對話）
   問候、感謝、詢問功能等

請務必回傳純 JSON，不要有任何其他文字。`;

  const payload = {
    contents: [{
      parts: [{
        text: `${systemPrompt}\n\n我的訊息：${userMessage}`
      }]
    }]
  };
  
  const options = {
    method: 'POST',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey }, // 金鑰放標頭，不放網址（網址會留在紀錄裡）
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log('Gemini HTTP Status: ' + statusCode);
    
    if (statusCode !== 200) {
      Logger.log('Gemini API 錯誤: ' + responseText);
      return {
        intent: 'general_chat',
        reply_text: '系統暫時繁忙，請稍後再試！'
      };
    }
    
    const result = JSON.parse(responseText);
    
    if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
      return {
        intent: 'general_chat',
        reply_text: '抱歉，我沒聽懂，可以再說一次嗎？'
      };
    }
    
    const aiText = result.candidates[0].content.parts[0].text;
    Logger.log('Gemini 原始回應: ' + aiText);
    
    let cleanedText = aiText
      .replace(/```json\n?|\n?```/g, '')
      .replace(/^[^{]*/g, '')
      .replace(/[^}]*$/g, '')
      .trim();
    
    try {
      const parsedResult = JSON.parse(cleanedText);
      Logger.log('解析結果: ' + JSON.stringify(parsedResult));
      return parsedResult;
    } catch (parseError) {
      Logger.log('JSON 解析失敗: ' + parseError);
      return {
        intent: 'general_chat',
        reply_text: '抱歉，我沒聽懂，可以再說一次嗎？'
      };
    }
    
  } catch (error) {
    Logger.log('Gemini 調用失敗: ' + error);
    return {
      intent: 'general_chat',
      reply_text: '系統暫時繁忙，請稍後再試！'
    };
  }
}
