// ===== 回覆訊息 =====
function replyToLine(replyToken, message) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'text',
      text: message
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    UrlFetchApp.fetch(url, options);
  } catch (error) {
    Logger.log('Reply Error: ' + error);
  }
}

// ===== 回覆行程記錄成功卡片 =====
function replyEventSuccessCard(replyToken, result) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  const flexMessage = {
    type: "bubble",
    hero: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "✅ 已記錄行程",
          weight: "bold",
          size: "xl",
          color: "#FFFFFF"
        }
      ],
      backgroundColor: "#4CAF50",
      paddingAll: "20px"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: "📅",
              size: "lg",
              flex: 0
            },
            {
              type: "text",
              text: "日期時間",
              size: "sm",
              color: "#999999",
              flex: 2,
              margin: "md"
            },
            {
              type: "text",
              text: `${result.date} ${result.time}`,
              size: "sm",
              color: "#111111",
              flex: 4,
              wrap: true
            }
          ],
          spacing: "sm"
        },
        {
          type: "separator",
          margin: "lg"
        },
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: "📝",
              size: "lg",
              flex: 0
            },
            {
              type: "text",
              text: "事項",
              size: "sm",
              color: "#999999",
              flex: 2,
              margin: "md"
            },
            {
              type: "text",
              text: result.item,
              size: "sm",
              color: "#111111",
              flex: 4,
              wrap: true
            }
          ],
          spacing: "sm",
          margin: "lg"
        },
        {
          type: "separator",
          margin: "lg"
        },
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: "🔢",
              size: "lg",
              flex: 0
            },
            {
              type: "text",
              text: "編號",
              size: "sm",
              color: "#999999",
              flex: 2,
              margin: "md"
            },
            {
              type: "text",
              text: `#${result.id}`,
              size: "sm",
              color: "#FF6B6B",
              flex: 4,
              weight: "bold"
            }
          ],
          spacing: "sm",
          margin: "lg"
        },
        {
          type: "separator",
          margin: "lg"
        },
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: "⏰",
              size: "lg",
              flex: 0
            },
            {
              type: "text",
              text: "提醒",
              size: "sm",
              color: "#999999",
              flex: 2,
              margin: "md"
            },
            {
              type: "text",
              text: "會在30分鐘前提醒你",
              size: "sm",
              color: "#4CAF50",
              flex: 4,
              wrap: true
            }
          ],
          spacing: "sm",
          margin: "lg"
        }
      ]
    }
  };
  
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'flex',
      altText: `已記錄行程：${result.item}`,
      contents: flexMessage
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}

// ===== 回覆待辦記錄成功卡片 =====
function replyTodoSuccessCard(replyToken, result) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  const categoryEmoji = {
    '工作': '💼', '購物': '🛒', '財務': '💰', '溝通': '📞',
    '學習': '📚', '健康': '💪', '娛樂': '🎮', '家務': '🏠', '其他': '📝'
  };
  
  const emoji = categoryEmoji[result.category] || '📝';
  
  const flexMessage = {
    type: "bubble",
    hero: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "✅ 已加入待辦清單",
          weight: "bold",
          size: "xl",
          color: "#FFFFFF"
        }
      ],
      backgroundColor: "#2196F3",
      paddingAll: "20px"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: emoji,
              size: "lg",
              flex: 0
            },
            {
              type: "text",
              text: "事項",
              size: "sm",
              color: "#999999",
              flex: 2,
              margin: "md"
            },
            {
              type: "text",
              text: result.item,
              size: "sm",
              color: "#111111",
              flex: 4,
              wrap: true
            }
          ],
          spacing: "sm"
        },
        {
          type: "separator",
          margin: "lg"
        },
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: "📂",
              size: "lg",
              flex: 0
            },
            {
              type: "text",
              text: "類別",
              size: "sm",
              color: "#999999",
              flex: 2,
              margin: "md"
            },
            {
              type: "text",
              text: result.category,
              size: "sm",
              color: "#2196F3",
              flex: 4,
              weight: "bold"
            }
          ],
          spacing: "sm",
          margin: "lg"
        },
        {
          type: "separator",
          margin: "lg"
        },
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: "🔢",
              size: "lg",
              flex: 0
            },
            {
              type: "text",
              text: "編號",
              size: "sm",
              color: "#999999",
              flex: 2,
              margin: "md"
            },
            {
              type: "text",
              text: `#${result.id}`,
              size: "sm",
              color: "#FF6B6B",
              flex: 4,
              weight: "bold"
            }
          ],
          spacing: "sm",
          margin: "lg"
        }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `完成後請輸入「完成#${result.id}」`,
          size: "xs",
          color: "#999999",
          align: "center"
        }
      ],
      paddingAll: "12px"
    }
  };
  
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'flex',
      altText: `已加入待辦：${result.item}`,
      contents: flexMessage
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}

// ===== 回覆備忘錄記錄成功卡片 =====
function replyMemoSuccessCard(replyToken, result) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  const flexMessage = {
    type: "bubble",
    hero: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "✅ 已儲存備忘錄",
          weight: "bold",
          size: "xl",
          color: "#FFFFFF"
        }
      ],
      backgroundColor: "#9C27B0",
      paddingAll: "20px"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: "📝",
              size: "lg",
              flex: 0
            },
            {
              type: "text",
              text: "內容",
              size: "sm",
              color: "#999999",
              flex: 2,
              margin: "md"
            },
            {
              type: "text",
              text: result.content,
              size: "sm",
              color: "#111111",
              flex: 4,
              wrap: true
            }
          ],
          spacing: "sm"
        },
        {
          type: "separator",
          margin: "lg"
        },
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: "🔢",
              size: "lg",
              flex: 0
            },
            {
              type: "text",
              text: "編號",
              size: "sm",
              color: "#999999",
              flex: 2,
              margin: "md"
            },
            {
              type: "text",
              text: `#${result.id}`,
              size: "sm",
              color: "#FF6B6B",
              flex: 4,
              weight: "bold"
            }
          ],
          spacing: "sm",
          margin: "lg"
        }
      ]
    }
  };
  
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'flex',
      altText: `已儲存備忘錄`,
      contents: flexMessage
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}

// ===== 回覆今日行程卡片（加入按鈕）=====
function replyTodayEventsCard(replyToken, events) {
  const today = Utilities.formatDate(new Date(), 'GMT+8', 'MM/dd (E)');
  replyDayEventsCardWithButtons(replyToken, events, `今天 ${today}`, "#FF6B6B");
}

// ===== 回覆指定日期行程卡片（加入按鈕）=====
function replyDayEventsCard(replyToken, events, dateLabel) {
  replyDayEventsCardWithButtons(replyToken, events, dateLabel, "#FF9800");
}

// ===== 通用單日行程卡片（按鈕在下方）=====
function replyDayEventsCardWithButtons(replyToken, events, title, color) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  if (events.length === 0) {
    replyToLine(replyToken, `📅 ${title}\n\n這天沒有安排行程\n\n好好享受自由時光！😊`);
    return;
  }
  
  // 建立事項列表（按鈕在下方）
  const eventBoxes = events.map(event => {
    return {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: `#${event.id}`,
              size: "xs",
              color: "#999999",
              flex: 0
            },
            {
              type: "text",
              text: event.time,
              size: "sm",
              weight: "bold",
              color: color,
              flex: 0,
              margin: "md"
            },
            {
              type: "text",
              text: event.item,
              size: "sm",
              wrap: true,
              color: "#111111",
              flex: 1,
              margin: "md"
            }
          ]
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "button",
              action: {
                type: "message",
                label: "✅ 完成",
                text: `完成行程#${event.id}`
              },
              style: "primary",
              color: "#4CAF50",
              height: "sm"
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "❌ 刪除",
                text: `刪除行程#${event.id}`
              },
              style: "secondary",
              height: "sm",
              margin: "xs"
            }
          ],
          margin: "sm"
        }
      ],
      margin: "md",
      paddingAll: "md",
      backgroundColor: "#F5F5F5",
      cornerRadius: "md"
    };
  });
  
  const flexMessage = {
    type: "bubble",
    hero: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `📅 ${title}`,
          weight: "bold",
          size: "xl",
          color: "#FFFFFF"
        }
      ],
      backgroundColor: color,
      paddingAll: "20px"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "🔥",
              size: "xxl",
              flex: 0
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: `${events.length}`,
                  weight: "bold",
                  size: "xxl",
                  color: color
                },
                {
                  type: "text",
                  text: "個行程",
                  size: "sm",
                  color: "#999999"
                }
              ],
              margin: "md"
            }
          ],
          margin: "lg"
        },
        {
          type: "separator",
          margin: "xl"
        },
        {
          type: "box",
          layout: "vertical",
          contents: eventBoxes,
          margin: "lg"
        }
      ]
    }
  };
  
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'flex',
      altText: `${title}有 ${events.length} 個行程`,
      contents: flexMessage
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}

// ===== 回覆本週行程卡片（簡化版，不加按鈕）=====
function replyWeekEventsCard(replyToken, events) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  if (events.length === 0) {
    replyToLine(replyToken, `📅 本週行程\n\n本週沒有安排行程\n\n好好享受自由時光！😊`);
    return;
  }
  
  // 按日期分組
  const grouped = {};
  events.forEach(event => {
    const dateKey = event.date;
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(event);
  });
  
  // 建立每日行程
  const dayBoxes = [];
  Object.keys(grouped).sort().forEach(date => {
    const dayEvents = grouped[date];
    const dateObj = new Date(date);
    const dayLabel = Utilities.formatDate(dateObj, 'GMT+8', 'MM/dd (E)');
    
    dayBoxes.push({
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: dayLabel,
          size: "sm",
          weight: "bold",
          color: "#4CAF50"
        }
      ],
      margin: "lg"
    });
    
    dayEvents.forEach(event => {
      dayBoxes.push({
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: `#${event.id}`,
            size: "xs",
            color: "#999999",
            flex: 1
          },
          {
            type: "text",
            text: event.time,
            size: "sm",
            color: "#666666",
            flex: 2,
            margin: "md"
          },
          {
            type: "text",
            text: event.item,
            size: "sm",
            wrap: true,
            color: "#111111",
            flex: 5,
            margin: "md"
          }
        ],
        margin: "sm",
        spacing: "sm"
      });
    });
  });
  
  const flexMessage = {
    type: "bubble",
    hero: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "📅 本週行程",
          weight: "bold",
          size: "xl",
          color: "#FFFFFF"
        }
      ],
      backgroundColor: "#4CAF50",
      paddingAll: "20px"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "📆",
              size: "xxl",
              flex: 0
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: `${events.length}`,
                  weight: "bold",
                  size: "xxl",
                  color: "#4CAF50"
                },
                {
                  type: "text",
                  text: "個行程",
                  size: "sm",
                  color: "#999999"
                }
              ],
              margin: "md"
            }
          ],
          margin: "lg"
        },
        {
          type: "separator",
          margin: "xl"
        },
        {
          type: "box",
          layout: "vertical",
          contents: dayBoxes,
          margin: "lg"
        }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "輸入指定日期查看詳細（例如：今天、明天）",
          size: "xs",
          color: "#999999",
          align: "center",
          wrap: true
        }
      ],
      paddingAll: "12px"
    }
  };
  
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'flex',
      altText: `本週有 ${events.length} 個行程`,
      contents: flexMessage
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}

// ===== 回覆本月行程卡片 =====
function replyMonthEventsCard(replyToken, events) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  const now = new Date();
  const monthLabel = Utilities.formatDate(now, 'GMT+8', 'yyyy年MM月');
  
  if (events.length === 0) {
    replyToLine(replyToken, `📅 ${monthLabel}\n\n本月沒有安排行程\n\n好好享受自由時光！😊`);
    return;
  }
  
  // 只顯示前20個（避免卡片太長）
  const displayEvents = events.slice(0, 20);
  
  const eventBoxes = displayEvents.map(event => {
    return {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: `#${event.id}`,
          size: "xs",
          color: "#999999",
          flex: 1
        },
        {
          type: "text",
          text: `${event.date} ${event.time}`,
          size: "xs",
          color: "#666666",
          flex: 4,
          margin: "md"
        },
        {
          type: "text",
          text: event.item,
          size: "sm",
          wrap: true,
          color: "#111111",
          flex: 4,
          margin: "md"
        }
      ],
      margin: "sm",
      spacing: "sm"
    };
  });
  
  const flexMessage = {
    type: "bubble",
    hero: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `📅 ${monthLabel}`,
          weight: "bold",
          size: "xl",
          color: "#FFFFFF"
        }
      ],
      backgroundColor: "#2196F3",
      paddingAll: "20px"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "📆",
              size: "xxl",
              flex: 0
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: `${events.length}`,
                  weight: "bold",
                  size: "xxl",
                  color: "#2196F3"
                },
                {
                  type: "text",
                  text: "個行程",
                  size: "sm",
                  color: "#999999"
                }
              ],
              margin: "md"
            }
          ],
          margin: "lg"
        },
        {
          type: "separator",
          margin: "xl"
        },
        {
          type: "box",
          layout: "vertical",
          contents: eventBoxes,
          margin: "lg"
        }
      ]
    },
    footer: events.length > 20 ? {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `僅顯示前20個，共${events.length}個行程`,
          size: "xs",
          color: "#999999",
          align: "center"
        }
      ],
      paddingAll: "12px"
    } : undefined
  };
  
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'flex',
      altText: `${monthLabel}有 ${events.length} 個行程`,
      contents: flexMessage
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}

// ===== 回覆全部行程卡片（按月分組）=====
function replyAllEventsCard(replyToken, groupedEvents) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  const months = Object.keys(groupedEvents).sort();
  
  if (months.length === 0) {
    replyToLine(replyToken, `📅 所有行程\n\n目前沒有任何行程\n\n開始規劃你的生活吧！😊`);
    return;
  }
  
  // 計算總數
  let totalCount = 0;
  months.forEach(month => {
    totalCount += groupedEvents[month].length;
  });
  
  // 建立月份小卡
  const monthBoxes = months.map(month => {
    const events = groupedEvents[month];
    const monthLabel = month.replace('/', '年') + '月';
    
    return {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: monthLabel,
              size: "sm",
              weight: "bold",
              color: "#FFFFFF"
            },
            {
              type: "text",
              text: `${events.length} 個行程`,
              size: "xs",
              color: "#FFFFFF",
              margin: "sm"
            }
          ],
          backgroundColor: "#9C27B0",
          cornerRadius: "md",
          paddingAll: "md",
          flex: 1
        }
      ],
      margin: "md"
    };
  });
  
  const flexMessage = {
    type: "bubble",
    hero: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "📅 所有行程",
          weight: "bold",
          size: "xl",
          color: "#FFFFFF"
        }
      ],
      backgroundColor: "#9C27B0",
      paddingAll: "20px"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "📊",
              size: "xxl",
              flex: 0
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: `${totalCount}`,
                  weight: "bold",
                  size: "xxl",
                  color: "#9C27B0"
                },
                {
                  type: "text",
                  text: "個行程",
                  size: "sm",
                  color: "#999999"
                }
              ],
              margin: "md"
            }
          ],
          margin: "lg"
        },
        {
          type: "separator",
          margin: "xl"
        },
        {
          type: "text",
          text: "各月分布",
          size: "sm",
          color: "#999999",
          margin: "lg"
        },
        {
          type: "box",
          layout: "vertical",
          contents: monthBoxes,
          margin: "md"
        }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "輸入「本週」或「本月」查看詳細行程",
          size: "xs",
          color: "#999999",
          align: "center"
        }
      ],
      paddingAll: "12px"
    }
  };
  
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'flex',
      altText: `共有 ${totalCount} 個行程`,
      contents: flexMessage
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}

// ===== 回覆待辦清單卡片（按鈕在下方）=====
function replyTodoListCard(replyToken, todos) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  if (todos.length === 0) {
    replyToLine(replyToken, '📋 待辦清單是空的\n\n太棒了！沒有未完成的事項 🎉');
    return;
  }
  
  const categoryEmoji = {
    '工作': '💼', '購物': '🛒', '財務': '💰', '溝通': '📞',
    '學習': '📚', '健康': '💪', '娛樂': '🎮', '家務': '🏠', '其他': '📝'
  };
  
  // 按類別分組
  const grouped = {};
  todos.forEach(todo => {
    const category = todo.category || '其他';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(todo);
  });
  
  // 建立待辦列表（按鈕在下方）
  const todoBoxes = [];
  Object.keys(grouped).forEach(category => {
    const emoji = categoryEmoji[category] || '📝';
    
    todoBoxes.push({
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: `${emoji} ${category}`,
          size: "sm",
          weight: "bold",
          color: "#666666"
        }
      ],
      margin: "lg"
    });
    
    grouped[category].forEach(todo => {
      todoBoxes.push({
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: `#${todo.id}`,
                size: "xs",
                color: "#999999",
                flex: 0
              },
              {
                type: "text",
                text: todo.item,
                size: "sm",
                wrap: true,
                color: "#111111",
                flex: 1,
                margin: "md"
              }
            ]
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "button",
                action: {
                  type: "message",
                  label: "✅ 完成",
                  text: `完成#${todo.id}`
                },
                style: "primary",
                color: "#4CAF50",
                height: "sm"
              },
              {
                type: "button",
                action: {
                  type: "message",
                  label: "❌ 刪除",
                  text: `刪除待辦#${todo.id}`
                },
                style: "secondary",
                height: "sm",
                margin: "xs"
              }
            ],
            margin: "sm"
          }
        ],
        margin: "sm",
        paddingAll: "md",
        backgroundColor: "#F5F5F5",
        cornerRadius: "md"
      });
    });
  });
  
  const flexMessage = {
    type: "bubble",
    hero: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "📋 待辦清單",
          weight: "bold",
          size: "xl",
          color: "#FFFFFF"
        }
      ],
      backgroundColor: "#4CAF50",
      paddingAll: "20px"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "✅",
              size: "xxl",
              flex: 0
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: `${todos.length}`,
                  weight: "bold",
                  size: "xxl",
                  color: "#4CAF50"
                },
                {
                  type: "text",
                  text: "個待辦",
                  size: "sm",
                  color: "#999999"
                }
              ],
              margin: "md"
            }
          ],
          margin: "lg"
        },
        {
          type: "separator",
          margin: "xl"
        },
        {
          type: "box",
          layout: "vertical",
          contents: todoBoxes,
          margin: "lg"
        }
      ]
    }
  };
  
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'flex',
      altText: `待辦清單（${todos.length}項）`,
      contents: flexMessage
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}

// ===== 回覆備忘錄卡片（修正按鈕）=====
function replyMemoListCard(replyToken, memos) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  if (memos.length === 0) {
    replyToLine(replyToken, '📝 備忘錄是空的\n\n還沒有任何備忘錄');
    return;
  }
  
  const memoBoxes = memos.map(memo => {
    const dateStr = typeof memo.created === 'string' 
      ? memo.created 
      : Utilities.formatDate(new Date(memo.created), 'GMT+8', 'MM/dd HH:mm');
    
    return {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: `#${memo.id}`,
              size: "xs",
              color: "#999999",
              flex: 1
            },
            {
              type: "text",
              text: dateStr,
              size: "xs",
              color: "#999999",
              flex: 3,
              margin: "md"
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "❌",
                text: `刪除備忘#${memo.id}`
              },
              style: "secondary",
              height: "sm",
              flex: 2
            }
          ],
          margin: "md"
        },
        {
          type: "text",
          text: memo.content,
          size: "sm",
          wrap: true,
          color: "#111111",
          margin: "sm"
        },
        {
          type: "separator",
          margin: "md"
        }
      ]
    };
  });
  
  const flexMessage = {
    type: "bubble",
    hero: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "📝 備忘錄",
          weight: "bold",
          size: "xl",
          color: "#FFFFFF"
        }
      ],
      backgroundColor: "#2196F3",
      paddingAll: "20px"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "📌",
              size: "xxl",
              flex: 0
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: `${memos.length}`,
                  weight: "bold",
                  size: "xxl",
                  color: "#2196F3"
                },
                {
                  type: "text",
                  text: "筆備忘",
                  size: "sm",
                  color: "#999999"
                }
              ],
              margin: "md"
            }
          ],
          margin: "lg"
        },
        {
          type: "separator",
          margin: "xl"
        },
        {
          type: "box",
          layout: "vertical",
          contents: memoBoxes,
          margin: "lg"
        }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "❌ 刪除",
          size: "xs",
          color: "#999999",
          align: "center"
        }
      ],
      paddingAll: "12px"
    }
  };
  
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'flex',
      altText: `備忘錄（${memos.length}筆）`,
      contents: flexMessage
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}

// ===== Push 訊息（提醒用）=====
function pushToLine(userId, message) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/push';
  
  const payload = {
    to: userId,
    messages: [{
      type: 'text',
      text: message
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    UrlFetchApp.fetch(url, options);
  } catch (error) {
    Logger.log('Push Error: ' + error);
  }
}

// ===== 回覆批量行程記錄成功卡片 =====
function replyMultipleEventsSuccessCard(replyToken, results) {
  const accessToken = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  if (!results.success || results.events.length === 0) {
    replyToLine(replyToken, '❌ 行程記錄失敗，請再試一次');
    return;
  }
  
  // 建立行程列表
  const eventBoxes = results.events.map(event => {
    return {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: `#${event.id}`,
          size: "xs",
          color: "#999999",
          flex: 1
        },
        {
          type: "text",
          text: event.time,
          size: "sm",
          weight: "bold",
          color: "#FF6B6B",
          flex: 2,
          margin: "md"
        },
        {
          type: "text",
          text: event.item,
          size: "sm",
          wrap: true,
          color: "#111111",
          flex: 4,
          margin: "md"
        }
      ],
      margin: "md",
      spacing: "sm"
    };
  });
  
  const flexMessage = {
    type: "bubble",
    hero: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "✅ 已記錄多個行程",
          weight: "bold",
          size: "xl",
          color: "#FFFFFF"
        }
      ],
      backgroundColor: "#4CAF50",
      paddingAll: "20px"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "🔥",
              size: "xxl",
              flex: 0
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: `${results.events.length}`,
                  weight: "bold",
                  size: "xxl",
                  color: "#4CAF50"
                },
                {
                  type: "text",
                  text: "個行程",
                  size: "sm",
                  color: "#999999"
                }
              ],
              margin: "md"
            }
          ],
          margin: "lg"
        },
        {
          type: "separator",
          margin: "xl"
        },
        {
          type: "box",
          layout: "vertical",
          contents: eventBoxes,
          margin: "lg"
        },
        {
          type: "separator",
          margin: "xl"
        },
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: "⏰",
              size: "lg",
              flex: 0
            },
            {
              type: "text",
              text: "提醒",
              size: "sm",
              color: "#999999",
              flex: 2,
              margin: "md"
            },
            {
              type: "text",
              text: "會在30分鐘前提醒你",
              size: "sm",
              color: "#4CAF50",
              flex: 4,
              wrap: true
            }
          ],
          spacing: "sm",
          margin: "lg"
        }
      ]
    }
  };
  
  const payload = {
    replyToken: replyToken,
    messages: [{
      type: 'flex',
      altText: `已記錄 ${results.events.length} 個行程`,
      contents: flexMessage
    }]
  };
  
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, options);
}
