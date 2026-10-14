// ===== 儲存 User ID =====
function saveUserId(userId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('用戶資料');
  const data = sheet.getDataRange().getValues();
  
  // 檢查是否已存在
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      // 更新最後活躍時間
      sheet.getRange(i + 1, 3).setValue(new Date());
      return;
    }
  }
  
  // 不存在則新增
  const now = Utilities.formatDate(new Date(), 'GMT+8', 'yyyy/MM/dd HH:mm');
  sheet.appendRow([userId, '用戶', now]);
  Logger.log('新用戶已儲存: ' + userId);
}

// ===== 獲取所有 User ID =====
function getAllUserIds() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('用戶資料');
  const data = sheet.getDataRange().getValues();
  
  const userIds = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      userIds.push(data[i][0]);
    }
  }
  
  return userIds;
}

// ===== 新增行程 =====
function addEvent(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  
  const lastRow = sheet.getLastRow();
  const newId = lastRow > 1 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;
  
  const date = params.date || '';
  const time = params.time || '';
  const item = params.item || '';
  
  sheet.appendRow([
    newId,
    date,
    time,
    item,
    '未提醒',
    '待辦'
  ]);
  
  return { 
    success: true, 
    id: newId,
    date: date,
    time: time,
    item: item
  };
}

// ===== 新增待辦 =====
function addTodo(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('待辦清單');
  
  const lastRow = sheet.getLastRow();
  const newId = lastRow > 1 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;
  
  const item = params.item || '';
  const category = params.category || '其他';
  const now = Utilities.formatDate(new Date(), 'GMT+8', 'yyyy/MM/dd HH:mm');
  
  sheet.appendRow([
    newId,
    item,
    now,
    category,
    '待辦',
    ''
  ]);
  
  return { 
    success: true, 
    id: newId,
    item: item,
    category: category
  };
}

// ===== 新增備忘錄 =====
function addMemo(params) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('備忘錄');
  
  const lastRow = sheet.getLastRow();
  const newId = lastRow > 1 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;
  
  const content = params.content || '';
  const now = Utilities.formatDate(new Date(), 'GMT+8', 'yyyy/MM/dd HH:mm');
  
  sheet.appendRow([
    newId,
    content,
    now
  ]);
  
  return { 
    success: true, 
    id: newId,
    content: content
  };
}

// ===== 完成待辦 =====
function completeTodo(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('待辦清單');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      const item = data[i][1];
      const category = data[i][3];
      const now = Utilities.formatDate(new Date(), 'GMT+8', 'yyyy/MM/dd HH:mm');
      
      sheet.getRange(i + 1, 5).setValue('已完成');
      sheet.getRange(i + 1, 6).setValue(now);
      
      return {
        success: true,
        message: `🎉 太棒了！\n\n✅ 已完成 [${category}]：${item}`
      };
    }
  }
  
  return {
    success: false,
    message: `❌ 找不到編號 #${id} 的待辦事項`
  };
}

// ===== 刪除行程 =====
function deleteEvent(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      const item = data[i][3];
      sheet.deleteRow(i + 1);
      
      return {
        success: true,
        message: `✅ 已刪除行程\n\n📝 ${item}`
      };
    }
  }
  
  return {
    success: false,
    message: `❌ 找不到編號 #${id} 的行程`
  };
}

// ===== 獲取待辦清單 =====
function getTodoList() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('待辦清單');
  const data = sheet.getDataRange().getValues();
  
  const todos = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === '待辦') {
      todos.push({
        id: data[i][0],
        item: data[i][1],
        created: data[i][2],
        category: data[i][3]
      });
    }
  }
  
  return todos;
}

// ===== 獲取備忘錄列表 =====
function getMemoList() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('備忘錄');
  const data = sheet.getDataRange().getValues();
  
  const memos = [];
  
  for (let i = 1; i < data.length; i++) {
    memos.push({
      id: data[i][0],
      content: data[i][1],
      created: data[i][2]
    });
  }
  
  return memos.reverse().slice(0, 10);
}

// ===== 獲取今天的行程 =====
function getTodayEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const data = sheet.getDataRange().getValues();
  
  const now = new Date();
  const today = Utilities.formatDate(now, 'GMT+8', 'yyyy/MM/dd');
  
  Logger.log('查詢今天的行程，今天是: ' + today);
  
  const events = [];
  
  for (let i = 1; i < data.length; i++) {
    let eventDate = data[i][1];
    let eventTime = data[i][2];
    
    // ===== 處理日期 =====
    if (typeof eventDate === 'string') {
      try {
        const dateObj = new Date(eventDate);
        if (!isNaN(dateObj.getTime())) {
          eventDate = Utilities.formatDate(dateObj, 'GMT+8', 'yyyy/MM/dd');
        }
      } catch (e) {
        Logger.log('日期解析失敗: ' + eventDate);
      }
    } else if (eventDate instanceof Date) {
      eventDate = Utilities.formatDate(eventDate, 'GMT+8', 'yyyy/MM/dd');
    }
    
    // ===== 處理時間（重要！）=====
    if (eventTime instanceof Date) {
      // 如果是 Date 物件，格式化為 HH:mm
      eventTime = Utilities.formatDate(eventTime, 'GMT+8', 'HH:mm');
    } else if (typeof eventTime === 'string') {
      // 如果已經是字串，保持原樣
      eventTime = eventTime;
    } else {
      // 其他情況，轉為字串
      eventTime = String(eventTime);
    }
    
    Logger.log(`比對: Sheet中的日期=${eventDate}, 時間=${eventTime}, 今天=${today}, 狀態=${data[i][5]}`);
    
    if (eventDate === today && data[i][5] === '待辦') {
      events.push({
        id: data[i][0],
        date: eventDate,
        time: eventTime,
        item: data[i][3]
      });
    }
  }
  
  return events.sort((a, b) => a.time.localeCompare(b.time));
}

// ===== 獲取即將到來的行程 =====
function getUpcomingEvents(limit) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const data = sheet.getDataRange().getValues();
  
  const now = new Date();
  const events = [];
  
  for (let i = 1; i < data.length; i++) {
    let eventDate = data[i][1];
    let eventTime = data[i][2];
    
    // 處理時間格式
    if (eventTime instanceof Date) {
      eventTime = Utilities.formatDate(eventTime, 'GMT+8', 'HH:mm');
    } else if (typeof eventTime === 'string') {
      eventTime = eventTime;
    } else {
      eventTime = String(eventTime);
    }
    
    // 處理日期
    if (typeof eventDate === 'string') {
      eventDate = eventDate;
    } else if (eventDate instanceof Date) {
      eventDate = Utilities.formatDate(eventDate, 'GMT+8', 'yyyy/MM/dd');
    }
    
    const eventDateTime = new Date(eventDate + ' ' + eventTime);
    
    if (eventDateTime >= now && data[i][5] === '待辦') {
      events.push({
        date: eventDate,
        time: eventTime,
        item: data[i][3]
      });
    }
  }
  
  return events
    .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
    .slice(0, limit);
}

// ===== 查詢行程 =====
function querySchedule(params) {
  return '請使用「今天」「待辦清單」「備忘錄」查詢';
}

// ===== 格式化待辦清單 =====
function formatTodoList(todos) {
  if (todos.length === 0) {
    return '📋 待辦清單是空的\n\n太棒了！沒有未完成的事項 🎉';
  }
  
  // 按類別分組
  const grouped = {};
  todos.forEach(todo => {
    const category = todo.category || '其他';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(todo);
  });
  
  let message = `📋 待辦清單（${todos.length}項）\n\n`;
  
  const categoryEmoji = {
    '工作': '💼', '購物': '🛒', '財務': '💰', '溝通': '📞',
    '學習': '📚', '健康': '💪', '娛樂': '🎮', '家務': '🏠', '其他': '📝'
  };
  
  Object.keys(grouped).forEach(category => {
    const emoji = categoryEmoji[category] || '📝';
    message += `${emoji} 【${category}】\n`;
    grouped[category].forEach(todo => {
      message += `  #${todo.id} ${todo.item}\n`;
    });
    message += '\n';
  });
  
  message += `完成後輸入「完成#編號」`;
  
  return message;
}

// ===== 格式化備忘錄列表 =====
function formatMemoList(memos) {
  if (memos.length === 0) {
    return '📝 備忘錄是空的\n\n還沒有任何備忘錄';
  }
  
  let message = `📝 備忘錄（最近${memos.length}筆）\n\n`;
  
  memos.forEach(memo => {
    message += `#${memo.id} ${memo.content}\n`;
    message += `   ${memo.created}\n\n`;
  });
  
  return message;
}

// ===== 格式化今天行程 =====
function formatTodayEvents(events) {
  const today = Utilities.formatDate(new Date(), 'GMT+8', 'yyyy/MM/dd (E)');
  
  if (events.length === 0) {
    return `📅 ${today}\n\n今天沒有安排行程\n\n好好享受自由時光！😊`;
  }
  
  let message = `📅 ${today}\n\n`;
  
  events.forEach(event => {
    message += `⏰ ${event.time} - ${event.item}\n`;
    message += `   #${event.id}\n\n`;
  });
  
  message += `取消行程輸入「取消#編號」`;
  
  return message;
}

// ===== 確保資料表存在 =====
function ensureDataExists() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 行事曆
  let calendarSheet = ss.getSheetByName('行事曆');
  if (!calendarSheet) {
    calendarSheet = ss.insertSheet('行事曆');
    calendarSheet.appendRow(['ID', '日期', '時間', '事項', '是否提醒', '狀態']);
  }
  
  // 待辦清單
  let todoSheet = ss.getSheetByName('待辦清單');
  if (!todoSheet) {
    todoSheet = ss.insertSheet('待辦清單');
    todoSheet.appendRow(['ID', '事項', '建立時間', '類別', '狀態', '完成時間']);
  }
  
  // 備忘錄
  let memoSheet = ss.getSheetByName('備忘錄');
  if (!memoSheet) {
    memoSheet = ss.insertSheet('備忘錄');
    memoSheet.appendRow(['ID', '內容', '建立時間']);
  }
  
  // 用戶資料
  let userSheet = ss.getSheetByName('用戶資料');
  if (!userSheet) {
    userSheet = ss.insertSheet('用戶資料');
    userSheet.appendRow(['User ID', '名稱', '最後活躍時間']);
  }
}

// ===== 獲取明天的行程 =====
function getTomorrowEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const data = sheet.getDataRange().getValues();
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = Utilities.formatDate(tomorrow, 'GMT+8', 'yyyy/MM/dd');
  
  return getEventsByDate(data, tomorrowStr);
}

// ===== 獲取後天的行程 =====
function getDayAfterTomorrowEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const data = sheet.getDataRange().getValues();
  
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const dayAfterStr = Utilities.formatDate(dayAfter, 'GMT+8', 'yyyy/MM/dd');
  
  return getEventsByDate(data, dayAfterStr);
}

// ===== 獲取本週的行程 =====
function getThisWeekEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const data = sheet.getDataRange().getValues();
  
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return getEventsByDateRange(data, weekStart, weekEnd);
}

// ===== 獲取本月的行程 =====
function getThisMonthEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const data = sheet.getDataRange().getValues();
  
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
  return getEventsByDateRange(data, monthStart, monthEnd);
}

// ===== 獲取所有行程（按月分組）=====
function getAllEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const data = sheet.getDataRange().getValues();
  
  const grouped = {};
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][5] !== '待辦') continue;
    
    let eventDate = data[i][1];
    let eventTime = data[i][2];
    
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
    
    const monthKey = eventDate.substring(0, 7); // "2026/01"
    
    if (!grouped[monthKey]) grouped[monthKey] = [];
    
    grouped[monthKey].push({
      id: data[i][0],
      date: eventDate,
      time: eventTime,
      item: data[i][3]
    });
  }
  
  // 排序
  Object.keys(grouped).forEach(month => {
    grouped[month].sort((a, b) => {
      const dateTimeA = new Date(a.date + ' ' + a.time);
      const dateTimeB = new Date(b.date + ' ' + b.time);
      return dateTimeA - dateTimeB;
    });
  });
  
  return grouped;
}

// ===== 獲取指定日期的行程 =====
function getSpecificDateEvents(dateStr) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const data = sheet.getDataRange().getValues();
  
  return getEventsByDate(data, dateStr);
}

// ===== 輔助函式：按日期獲取行程 =====
function getEventsByDate(data, targetDate) {
  const events = [];
  
  for (let i = 1; i < data.length; i++) {
    let eventDate = data[i][1];
    let eventTime = data[i][2];
    
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
    
    if (eventDate === targetDate && data[i][5] === '待辦') {
      events.push({
        id: data[i][0],
        date: eventDate,
        time: eventTime,
        item: data[i][3]
      });
    }
  }
  
  return events.sort((a, b) => a.time.localeCompare(b.time));
}

// ===== 輔助函式：按日期範圍獲取行程 =====
function getEventsByDateRange(data, startDate, endDate) {
  const events = [];
  
  for (let i = 1; i < data.length; i++) {
    let eventDate = data[i][1];
    let eventTime = data[i][2];
    
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
    
    if (eventDateTime >= startDate && eventDateTime <= endDate && data[i][5] === '待辦') {
      events.push({
        id: data[i][0],
        date: eventDate,
        time: eventTime,
        item: data[i][3]
      });
    }
  }
  
  return events.sort((a, b) => {
    const dateTimeA = new Date(a.date + ' ' + a.time);
    const dateTimeB = new Date(b.date + ' ' + b.time);
    return dateTimeA - dateTimeB;
  });
}

// ===== 批量新增行程 =====
function addMultipleEvents(eventsArray) {
  if (!eventsArray || eventsArray.length === 0) {
    return { success: false, events: [] };
  }
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const results = [];
  
  eventsArray.forEach(eventData => {
    const lastRow = sheet.getLastRow();
    const newId = lastRow > 1 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;
    
    const date = eventData.date || '';
    const time = eventData.time || '';
    const item = eventData.item || '';
    
    sheet.appendRow([
      newId,
      date,
      time,
      item,
      '未提醒',
      '待辦'
    ]);
    
    results.push({
      id: newId,
      date: date,
      time: time,
      item: item
    });
  });
  
  return { success: true, events: results };
}

// ===== 刪除待辦 =====
function deleteTodo(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('待辦清單');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      const item = data[i][1];
      sheet.deleteRow(i + 1);
      
      return {
        success: true,
        message: `✅ 已刪除待辦\n\n📝 ${item}`
      };
    }
  }
  
  return {
    success: false,
    message: `❌ 找不到編號 #${id} 的待辦事項`
  };
}

// ===== 刪除備忘錄 =====
function deleteMemo(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('備忘錄');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      const content = data[i][1];
      sheet.deleteRow(i + 1);
      
      return {
        success: true,
        message: `✅ 已刪除備忘錄\n\n📝 ${content}`
      };
    }
  }
  
  return {
    success: false,
    message: `❌ 找不到編號 #${id} 的備忘錄`
  };
}

// ===== 完成行程 =====
function completeEvent(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('行事曆');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      const item = data[i][3];
      
      // 將狀態改為「已完成」
      sheet.getRange(i + 1, 6).setValue('已完成');
      
      return {
        success: true,
        message: `🎉 太棒了！\n\n✅ 已完成行程：${item}`
      };
    }
  }
  
  return {
    success: false,
    message: `❌ 找不到編號 #${id} 的行程`
  };
}
