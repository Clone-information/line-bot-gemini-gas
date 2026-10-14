// ===== 主要進入點 =====
function doPost(e) {
  try {
    const events = JSON.parse(e.postData.contents).events;
    
    events.forEach(event => {
      if (event.type === 'message' && event.message.type === 'text') {
        handleMessage(event);
      } else if (event.type === 'follow') {
        handleNewUser(event);
      }
    });
    
  } catch (error) {
    Logger.log('Error: ' + error);
  }
  
  return HtmlService.createHtmlOutput('OK');
}

function doGet(e) {
  return HtmlService.createHtmlOutput('✅ AI 助理運作中！');
}

// ===== 新用戶歡迎 =====
function handleNewUser(event) {
  ensureDataExists();
  
  const welcomeMessage = `👋 歡迎使用 AI 助理！

我可以幫你：
📅 記錄行程（自動提醒）
✅ 管理待辦清單（AI智能分類）
📝 儲存備忘錄
📊 每日晨報 & 週報總結

快速開始：
「明天3點開會」
「記得要寄包裹」
「記一下客戶電話0912345678」
「今天有什麼事」
「本週行程」

讓我幫你管理生活！🚀`;

  replyToLine(event.replyToken, welcomeMessage);
}

// ===== 處理訊息 =====
function handleMessage(event) {
  const userMessage = event.message.text;
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  
  ensureDataExists();
  saveUserId(userId);
  
  // ===== 快速指令（不用 AI，直接處理）=====

  // 完成行程 ⭐ 新增
  if (userMessage.startsWith('完成行程#')) {
    const match = userMessage.match(/#(\d+)/);
    if (match) {
      const result = completeEvent(match[1]);
      replyToLine(replyToken, result.message);
      return;
    }
  }
  
  // 待辦清單
  if (userMessage === '待辦清單' || userMessage === '待辦' || userMessage === 'todo' || userMessage === 'TODO') {
    const todos = getTodoList();
    replyTodoListCard(replyToken, todos);
    return;
  }
  
  // 備忘錄
  if (userMessage === '備忘錄' || userMessage === '筆記' || userMessage === '備註' || userMessage === 'memo') {
    const memos = getMemoList();
    replyMemoListCard(replyToken, memos);
    return;
  }
  
  // 今天
  if (userMessage === '今天' || userMessage === '今日' || userMessage === '今天有什麼事') {
    const events = getTodayEvents();
    replyTodayEventsCard(replyToken, events);
    return;
  }
  
  // 明天
  if (userMessage === '明天' || userMessage === '明天的行程') {
    const events = getTomorrowEvents();
    replyDayEventsCard(replyToken, events, '明天');
    return;
  }
  
  // 後天
  if (userMessage === '後天') {
    const events = getDayAfterTomorrowEvents();
    replyDayEventsCard(replyToken, events, '後天');
    return;
  }
  
  // 本週
  if (userMessage === '本週' || userMessage === '本周' || userMessage === '這週' || userMessage === '這周' || userMessage === '本週行程') {
    const events = getThisWeekEvents();
    replyWeekEventsCard(replyToken, events);
    return;
  }
  
  // 本月
  if (userMessage === '本月' || userMessage === '這個月' || userMessage === '本月行程') {
    const events = getThisMonthEvents();
    replyMonthEventsCard(replyToken, events);
    return;
  }
  
  // 全部
  if (userMessage === '全部' || userMessage === '全部行程' || userMessage === '所有行程') {
    const events = getAllEvents();
    replyAllEventsCard(replyToken, events);
    return;
  }
  
  // 完成待辦
  if (userMessage.startsWith('完成#') || userMessage.startsWith('做完#')) {
    const match = userMessage.match(/#(\d+)/);
    if (match) {
      const result = completeTodo(match[1]);
      replyToLine(replyToken, result.message);
      return;
    }
  }
  
  // 刪除待辦 ⭐ 新增
  if (userMessage.startsWith('刪除待辦#') || userMessage.startsWith('刪待辦#')) {
    const match = userMessage.match(/#(\d+)/);
    if (match) {
      const result = deleteTodo(match[1]);
      replyToLine(replyToken, result.message);
      return;
    }
  }
  
  // 刪除行程 ⭐ 修改
  if (userMessage.startsWith('取消行程#') || userMessage.startsWith('刪除行程#') || userMessage.startsWith('刪行程#')) {
    const match = userMessage.match(/#(\d+)/);
    if (match) {
      const result = deleteEvent(match[1]);
      replyToLine(replyToken, result.message);
      return;
    }
  }
  
  // 刪除備忘錄 ⭐ 新增
  if (userMessage.startsWith('刪除備忘#') || userMessage.startsWith('刪備忘#')) {
    const match = userMessage.match(/#(\d+)/);
    if (match) {
      const result = deleteMemo(match[1]);
      replyToLine(replyToken, result.message);
      return;
    }
  }
  
  // 幫助
  if (userMessage === '幫助' || userMessage === '說明' || userMessage === 'help' || userMessage === '?' || userMessage === '？') {
    const helpMessage = `📚 AI 助理使用說明

📅 行程管理：
- 「明天3點開會」
- 「今天下午2點報告、3點討論、4點吃飯」
- 「1月10號早上9點會議」

✅ 待辦清單：
- 「記得要寄包裹」
- 「要買菜」
- 輸入「待辦清單」查看
- 完成：「完成#編號」
- 刪除：「刪除待辦#編號」

📝 備忘錄：
- 「記一下客戶電話0912345678」
- 輸入「備忘錄」查看
- 刪除：「刪除備忘#編號」

🔍 查詢行程：
- 今天、明天、後天
- 本週、本月、全部
- 1/10、1月10號
- 刪除：「刪除行程#編號」

⚡ 快速指令：
- 待辦清單、備忘錄
- 完成#編號
- 刪除待辦#編號
- 刪除行程#編號
- 刪除備忘#編號

有問題隨時問我！😊`;
    
    replyToLine(replyToken, helpMessage);
    return;
  }
  
  // ===== 其他情況交給 AI 處理 =====
  const aiResponse = callGemini(userMessage);
  
  switch(aiResponse.intent) {
    case 'add_event':
      const eventResult = addEvent(aiResponse.parameters);
      replyEventSuccessCard(replyToken, eventResult);
      break;
      
    case 'add_events':
      const eventsResults = addMultipleEvents(aiResponse.parameters.events);
      replyMultipleEventsSuccessCard(replyToken, eventsResults);
      break;
      
    case 'add_todo':
      const todoResult = addTodo(aiResponse.parameters);
      replyTodoSuccessCard(replyToken, todoResult);
      break;
      
    case 'add_memo':
      const memoResult = addMemo(aiResponse.parameters);
      replyMemoSuccessCard(replyToken, memoResult);
      break;
      
    case 'query_schedule':
      handleScheduleQuery(replyToken, aiResponse.parameters);
      break;
      
    case 'complete_todo':
      const completeResult = completeTodo(aiResponse.parameters.todo_id);
      replyToLine(replyToken, completeResult.message);
      break;
      
    case 'delete_event':
      const deleteResult = deleteEvent(aiResponse.parameters.event_id);
      replyToLine(replyToken, deleteResult.message);
      break;
      
    case 'general_chat':
      replyToLine(replyToken, aiResponse.reply_text);
      break;
      
    default:
      replyToLine(replyToken, 
        '我可以幫你：\n' +
        '📅 記錄行程：「明天3點開會」\n' +
        '✅ 待辦事項：「記得要寄包裹」\n' +
        '📝 備忘錄：「記一下電話號碼」\n' +
        '🔍 查詢：「今天」「待辦清單」「備忘錄」\n\n' +
        '輸入「幫助」查看完整說明'
      );
  }
}

// ===== 處理行程查詢 =====
function handleScheduleQuery(replyToken, params) {
  const queryType = params.query_type;
  
  switch(queryType) {
    case 'today':
      const todayEvents = getTodayEvents();
      replyTodayEventsCard(replyToken, todayEvents);
      break;
      
    case 'tomorrow':
      const tomorrowEvents = getTomorrowEvents();
      replyDayEventsCard(replyToken, tomorrowEvents, '明天');
      break;
      
    case 'day_after_tomorrow':
      const dayAfterEvents = getDayAfterTomorrowEvents();
      replyDayEventsCard(replyToken, dayAfterEvents, '後天');
      break;
      
    case 'this_week':
      const weekEvents = getThisWeekEvents();
      replyWeekEventsCard(replyToken, weekEvents);
      break;
      
    case 'this_month':
      const monthEvents = getThisMonthEvents();
      replyMonthEventsCard(replyToken, monthEvents);
      break;
      
    case 'all':
      const allEvents = getAllEvents();
      replyAllEventsCard(replyToken, allEvents);
      break;
      
    case 'specific_date':
      const specificEvents = getSpecificDateEvents(params.specific_date);
      replyDayEventsCard(replyToken, specificEvents, params.specific_date);
      break;
      
    default:
      replyToLine(replyToken, '請告訴我要查詢哪天的行程');
  }
}

// ===== 自動提醒、晨報、週報（保持不變）=====
function checkReminders() {
  const userIds = getAllUserIds();
  
  if (userIds.length === 0) {
    Logger.log('沒有用戶資料');
    return;
  }
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const data = sheet.getDataRange().getValues();
  
  const now = new Date();
  
  for (let i = 1; i < data.length; i++) {
    let eventDate = data[i][1];
    let eventTime = data[i][2];
    const reminded = data[i][4];
    const status = data[i][5];
    
    if (typeof eventDate === 'string') {
      eventDate = eventDate;
    } else if (eventDate instanceof Date) {
      eventDate = Utilities.formatDate(eventDate, 'GMT+8', 'yyyy/MM/dd');
    }
    
    if (eventTime instanceof Date) {
      eventTime = Utilities.formatDate(eventTime, 'GMT+8', 'HH:mm');
    } else if (typeof eventTime === 'string') {
      eventTime = eventTime;
    } else {
      eventTime = String(eventTime);
    }
    
    const eventDateTime = new Date(eventDate + ' ' + eventTime);
    
    if (reminded !== '已提醒' && status === '待辦') {
      const timeDiff = eventDateTime - now;
      
      if (timeDiff > 0 && timeDiff <= 30 * 60000) {
        const message = `⏰ 提醒！\n\n30分鐘後有行程\n📅 ${eventDate} ${eventTime}\n📝 ${data[i][3]}`;
        
        userIds.forEach(userId => {
          pushToLine(userId, message);
        });
        
        sheet.getRange(i + 1, 5).setValue('已提醒');
        Logger.log(`已發送提醒: ${data[i][3]}`);
      }
    }
  }
}

function dailyReport() {
  const userIds = getAllUserIds();
  
  if (userIds.length === 0) {
    Logger.log('沒有用戶資料');
    return;
  }
  
  const report = generateDailyReport();
  
  userIds.forEach(userId => {
    pushToLine(userId, report);
  });
  
  Logger.log('每日晨報已發送');
}

function weeklyReport() {
  const userIds = getAllUserIds();
  
  if (userIds.length === 0) {
    Logger.log('沒有用戶資料');
    return;
  }
  
  const report = generateWeeklyReport();
  
  userIds.forEach(userId => {
    pushToLine(userId, report);
  });
  
  Logger.log('週報總結已發送');
}

function generateDailyReport() {
  const today = Utilities.formatDate(new Date(), 'GMT+8', 'yyyy/MM/dd (E)');
  const events = getTodayEvents();
  const todos = getTodoList();
  
  let message = `☀️ 早安！${today}\n\n`;
  
  if (events.length > 0) {
    message += `📅 今日行程（${events.length}項）\n`;
    events.forEach(e => {
      message += `⏰ ${e.time} ${e.item}\n`;
    });
    message += '\n';
  }
  
  if (todos.length > 0) {
    message += `✅ 待辦事項（${todos.length}項）\n`;
    
    const grouped = {};
    todos.forEach(t => {
      const category = t.category || '一般';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(t);
    });
    
    Object.keys(grouped).forEach(category => {
      message += `\n【${category}】\n`;
      grouped[category].slice(0, 3).forEach(t => {
        message += `• ${t.item}\n`;
      });
      if (grouped[category].length > 3) {
        message += `...還有${grouped[category].length - 3}項\n`;
      }
    });
    message += '\n';
  }
  
  if (events.length === 0 && todos.length === 0) {
    message += '今天沒有安排，享受自由時光！😊';
  } else {
    message += '祝你有美好的一天！💪';
  }
  
  return message;
}

function generateWeeklyReport() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('待辦清單');
  const data = sheet.getDataRange().getValues();
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  let completedCount = 0;
  let pendingCount = 0;
  const completedByCategory = {};
  
  for (let i = 1; i < data.length; i++) {
    const status = data[i][4];
    const category = data[i][3] || '一般';
    const completedTime = data[i][5] ? new Date(data[i][5]) : null;
    
    if (status === '已完成' && completedTime && completedTime >= weekAgo) {
      completedCount++;
      completedByCategory[category] = (completedByCategory[category] || 0) + 1;
    }
    
    if (status === '待辦') {
      pendingCount++;
    }
  }
  
  let message = `📊 本週總結\n\n`;
  message += `✅ 完成事項：${completedCount} 項\n`;
  message += `⏳ 待辦事項：${pendingCount} 項\n\n`;
  
  if (completedCount > 0) {
    message += `📈 完成分布：\n`;
    Object.keys(completedByCategory).forEach(category => {
      message += `  ${category}：${completedByCategory[category]} 項\n`;
    });
    message += '\n';
  }
  
  if (completedCount >= 10) {
    message += `🏆 太棒了！完成了${completedCount}項任務！\n`;
  } else if (completedCount >= 5) {
    message += `👍 不錯！完成了${completedCount}項任務！\n`;
  } else if (completedCount > 0) {
    message += `💪 繼續努力！已完成${completedCount}項！\n`;
  } else {
    message += `🌟 下週一起加油！\n`;
  }
  
  if (pendingCount > 0) {
    message += `\n還有${pendingCount}項待辦，繼續保持！`;
  }
  
  return message;
}
