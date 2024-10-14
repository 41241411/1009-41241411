const cardContainer = document.getElementById("card-container");

const theme1 = [
  { front: "images/vegetablefront.png", back: "images/vegetable1.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable2.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable3.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable4.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable5.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable6.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable7.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable8.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable9.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable10.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable11.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable12.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable13.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable14.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable15.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable16.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable17.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable18.png" },
];

const theme2 = [
  { front: "images/halloweenfront.png", back: "images/halloween1.png" },
  { front: "images/halloweenfront.png", back: "images/halloween2.png" },
  { front: "images/halloweenfront.png", back: "images/halloween3.png" },
  { front: "images/halloweenfront.png", back: "images/halloween4.png" },
  { front: "images/halloweenfront.png", back: "images/halloween5.png" },
  { front: "images/halloweenfront.png", back: "images/halloween6.png" },
  { front: "images/halloweenfront.png", back: "images/halloween7.png" },
  { front: "images/halloweenfront.png", back: "images/halloween8.png" },
  { front: "images/halloweenfront.png", back: "images/halloween9.png" },
  { front: "images/halloweenfront.png", back: "images/halloween10.png" },
  { front: "images/halloweenfront.png", back: "images/halloween11.png" },
  { front: "images/halloweenfront.png", back: "images/halloween12.png" },
  { front: "images/halloweenfront.png", back: "images/halloween13.png" },
  { front: "images/halloweenfront.png", back: "images/halloween14.png" },
  { front: "images/halloweenfront.png", back: "images/halloween15.png" },
  { front: "images/halloweenfront.png", back: "images/halloween16.png" },
  { front: "images/halloweenfront.png", back: "images/halloween17.png" },
  { front: "images/halloweenfront.png", back: "images/halloween18.png" },
];

let currentTheme = [];
let flippedCards = []; // 存储当前翻转的卡片
let matchedCardsArray = []; // 用于存储成功配对的卡片
let canFlip = true; // 控制是否可以翻转卡片
let gameStartTime; // 记录游戏开始时间
let countdownInterval; // 用于倒计时的定时器
const successSound = new Audio("sounds/success.mp3"); // 成功配对的音效
const failSound = new Audio("sounds/fail.mp3"); // 失败配对的音效
const themeSelect = document.getElementById("theme-select");
const sizeSelect = document.getElementById("size-select");
const hideCheckbox = document.getElementById("hide-checkbox");
// 获取 BGM 元素
const bgm = document.getElementById("bgm");

window.onload = function () {
  // 页面加载后自动播放音乐（静音）
  bgm.play().catch((error) => {
    console.log("自动播放被阻止:", error);
    // 提示用户进行交互以播放音乐
  });
};

// 隐藏已配对卡牌的函数
function toggleMatchedCards() {
  matchedCardsArray.forEach((card) => {
    card.style.visibility = hideCheckbox.checked ? "hidden" : "visible";
  });
}

// 复选框点击事件
hideCheckbox.addEventListener("change", toggleMatchedCards);

// 更新选中按钮的函数
function updateSelectedButton(selectedId) {
  document.querySelectorAll(".button-container button").forEach((button) => {
    button.classList.remove("selected");
  });
  document.getElementById(selectedId).classList.add("selected");
}

// 选择主题的事件监听器
document.querySelectorAll('input[name="theme"]').forEach((input) => {
  input.addEventListener("click", () => {
    currentTheme = input.id === "theme-vegetable" ? [...theme1] : [...theme2];
  });
});

document.getElementById("size-select").addEventListener("change", function () {
  const selectedSize = this.value;
  const container = document.getElementById("card-container");
  container.setAttribute("data-size", selectedSize); // 设置网格尺寸
});

document.getElementById("start-game").onclick = () => {
  bgm.muted = false; // 取消静音
  bgm.play(); // 播放背景音乐
  document.getElementById("start-game").disabled = true;
  themeSelect.disabled = true;
  sizeSelect.disabled = true;

  // 检查是否选择了主题和尺寸
  if (themeSelect.value === "1" || sizeSelect.value === "2") {
    Swal.fire({
      title: "错误",
      text:
        themeSelect.value === "1" ? "请先选择一个主题！" : "请先选择一个尺寸！",
      icon: "error",
      confirmButtonText: "确定",
    }).then(() => {
      document.getElementById("start-game").disabled = false;
      themeSelect.disabled = false;
      sizeSelect.disabled = false;
    });
    return;
  }

  // 确定选择的主题并设置 currentTheme
  let currentTheme;
  if (themeSelect.value === "vegetable") {
    currentTheme = [...theme1, ...theme1]; // 选择蔬菜主题
  } else if (themeSelect.value === "halloween") {
    currentTheme = [...theme2, ...theme2]; // 选择万圣节主题
  }

  // 获取选择的尺寸
  const selectedSize = sizeSelect.value;

  // 根据选择的尺寸确定卡片对数
  let pairCount;
  if (selectedSize === "2x2") {
    pairCount = 2; // 2 对卡片
  } else if (selectedSize === "4x4") {
    pairCount = 8; // 8 对卡片
  } else if (selectedSize === "6x6") {
    pairCount = 18; // 18 对卡片
  }

  // 裁剪相应数量的卡片
  currentTheme = [
    ...currentTheme.slice(0, pairCount),
    ...currentTheme.slice(0, pairCount),
  ];

  // 清空卡片容器
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  // 打乱卡牌顺序
  shuffle(currentTheme);

  // 创建并添加卡片
  currentTheme.forEach((data) => {
    const card = createCard(data);
    cardContainer.appendChild(card);
  });

  // 开始倒计时
  startCountdown();
};

// 创建卡片的函数
function createCard(data) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="face front">
      <img src="${data.front}" alt="正面图片">
    </div>
    <div class="face back">
      <img src="${data.back}" alt="背面图片">
    </div>
  `;

  card.addEventListener("click", () => {
    if (!canFlip || card.classList.contains("flipped")) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      canFlip = false;
      setTimeout(() => {
        const [card1, card2] = flippedCards;
        const isMatch =
          card1.querySelector(".back img").src ===
          card2.querySelector(".back img").src;

        if (isMatch) {
          successSound.play();
          matchedCardsArray.push(card1, card2);

          // 将背面的背景颜色改为黄色
          card1.querySelector(".back").style.backgroundColor = "transparent";
          card2.querySelector(".back").style.backgroundColor = "transparent";

          if (hideCheckbox.checked) {
            card1.style.visibility = "hidden";
            card2.style.visibility = "hidden";
          }
          if (
            matchedCardsArray.length ===
            document.querySelectorAll(".card").length
          ) {
            endGame();
          }
        } else {
          failSound.play();
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
        }
        flippedCards = [];
        canFlip = true;
      }, 500);
    }
  });

  return card;
}

// 随机排列数组的函数
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 启动倒计时的函数
function startCountdown() {
  let countdownTime = 10;
  const countdownElement = document.getElementById("countdown");
  countdownElement.textContent = countdownTime;
  countdownElement.style.visibility = "visible";

  countdownInterval = setInterval(() => {
    countdownTime--;
    countdownElement.textContent = countdownTime;

    // 倒计时结束
    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
      countdownElement.style.visibility = "hidden";

      // 倒计时结束后翻回所有卡片
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("flipped"); // 确保所有卡片在倒计时结束时显示背面
      });

      canFlip = true; // 倒计时结束后允许翻转
      gameStartTime = Date.now(); // 记录游戏开始时间
      countdownElement.textContent = "遊玩時間: 0 秒"; // 初始显示为游戏时间

      // 显示游戏时间元素并初始化内容
      document.getElementById("game-time").style.visibility = "visible"; // 显示游戏时间元素
      document.getElementById("game-time").textContent = `遊玩時間: 0 秒`; // 初始化游戏时间内容

      // 开始计时更新
      gameTimerInterval = setInterval(() => {
        gameDuration = Math.floor((Date.now() - gameStartTime) / 1000); // 计算已过时间
        document.getElementById(
          "game-time"
        ).textContent = `遊玩時間: ${gameDuration} 秒`; // 更新游戏时间
      }, 100); // 每100毫秒更新一次显示
    }
  }, 1000);

  // 初始状态下先展示正面
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.add("flipped"); // 在游戏开始时先展示卡片的正面
  });

  canFlip = false; // 禁用翻转，直到倒计时结束
}

// 结束游戏的函数
function endGame() {
  clearInterval(gameTimerInterval);
  const gameEndTime = Date.now();
  const gameDuration = Math.floor((gameEndTime - gameStartTime) / 1000);
  Swal.fire({
    title: "遊戲結束",
    text: `所有卡片已匹配完成！\n您遊玩了 ${gameDuration} 秒!`,
    icon: "success",
    confirmButtonText: "重新開始",
  }).then(() => {
    location.reload();
    bgm.pause(); // 停止播放背景音乐
    bgm.currentTime = 0; // 重置音乐到开始位置
  });
}
