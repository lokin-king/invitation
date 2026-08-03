const yesBtn = document.querySelector("#yesBtn");
const noBtn = document.querySelector("#noBtn");
const againBtn = document.querySelector("#againBtn");
const continueBtn = document.querySelector("#continueBtn");
const finishBtn = document.querySelector("#finishBtn");
const hint = document.querySelector("#hint");
const choiceHint = document.querySelector("#choiceHint");
const scheduleHint = document.querySelector("#scheduleHint");
const sendStatus = document.querySelector("#sendStatus");
const dateInput = document.querySelector("#dateInput");
const timeInput = document.querySelector("#timeInput");
const finalDate = document.querySelector("#finalDate");
const finalTime = document.querySelector("#finalTime");
const finalChoice = document.querySelector("#finalChoice");
const finalText = document.querySelector("#finalText");
const cards = [...document.querySelectorAll(".date-card")];
const backButtons = [...document.querySelectorAll("[data-back]")];
const steps = [...document.querySelectorAll(".step")];
const canvas = document.querySelector("#sky");
const ctx = canvas.getContext("2d");

const CONFIG = {
  telegramEndpoint: "https://date-invitation-bot.20091979soa.workers.dev/"
};

const teasingLines = [
  "Ні? Мені здається, кнопка помилилась.",
  "Вона тікає, бо знає правильну відповідь.",
  "Давай ще раз. Я вірю в нас.",
  "Кнопка “Так” виглядає набагато щасливішою.",
  "Це майже неможливо натиснути. Майже."
];

let noAttempts = 0;
let selectedDateIdea = "";
let particles = [];
let burst = [];

function showStep(stepName) {
  steps.forEach((step) => {
    step.classList.toggle("is-active", step.dataset.step === stepName);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  seedParticles();
}

function seedParticles() {
  const total = Math.min(72, Math.max(34, Math.floor(window.innerWidth / 18)));
  particles = Array.from({ length: total }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.6 + 0.8,
    speed: Math.random() * 0.35 + 0.12,
    drift: Math.random() * 0.28 - 0.14,
    alpha: Math.random() * 0.32 + 0.12,
    hue: Math.random() > 0.5 ? "223, 79, 115" : "47, 137, 119"
  }));
}

function drawHeart(x, y, size, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.beginPath();
  ctx.moveTo(0, 0.35);
  ctx.bezierCurveTo(-1.7, -0.85, -0.8, -2.1, 0, -1.05);
  ctx.bezierCurveTo(0.8, -2.1, 1.7, -0.85, 0, 0.35);
  ctx.closePath();
  ctx.fillStyle = `rgba(${color}, ${alpha})`;
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((p) => {
    p.y -= p.speed;
    p.x += p.drift;
    if (p.y < -12) {
      p.y = window.innerHeight + 12;
      p.x = Math.random() * window.innerWidth;
    }
    drawHeart(p.x, p.y, p.r, p.hue, p.alpha);
  });

  burst = burst.filter((p) => p.life > 0);
  burst.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.025;
    p.life -= 0.018;
    drawHeart(p.x, p.y, p.size, p.color, Math.max(p.life, 0));
  });

  requestAnimationFrame(animate);
}

function moveNoButton() {
  const rect = noBtn.getBoundingClientRect();
  const padding = 18;
  const maxX = Math.max(padding, window.innerWidth - rect.width - padding);
  const maxY = Math.max(padding, window.innerHeight - rect.height - padding);
  const x = Math.floor(Math.random() * (maxX - padding) + padding);
  const y = Math.floor(Math.random() * (maxY - padding) + padding);

  noAttempts += 1;
  noBtn.classList.add("is-running");
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  yesBtn.style.transform = `scale(${Math.min(1 + noAttempts * 0.04, 1.22)})`;
  hint.textContent = teasingLines[(noAttempts - 1) % teasingLines.length];
}

function celebrate() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const colors = ["223, 79, 115", "255, 128, 100", "47, 137, 119", "93, 49, 83"];

  for (let i = 0; i < 90; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1.6;
    burst.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.3,
      size: Math.random() * 3 + 1.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: Math.random() * 0.6 + 0.5
    });
  }
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function validateSchedule() {
  const ready = Boolean(dateInput.value && timeInput.value);
  finishBtn.disabled = !ready;
  scheduleHint.textContent = ready
    ? "Все є. Натискай, і я отримаю наш план."
    : "Додай дату і час, щоб зробити запрошення офіційним.";
}

function selectCard(card) {
  selectedDateIdea = card.dataset.value;
  cards.forEach((item) => {
    const selected = item === card;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-checked", String(selected));
  });
  continueBtn.disabled = false;
  choiceHint.textContent = `Обрано: ${selectedDateIdea}. Мені вже подобається цей план.`;
}

async function sendTelegramChoice(payload) {
  if (!CONFIG.telegramEndpoint) {
    return { ok: false, skipped: true };
  }

  const response = await fetch(CONFIG.telegramEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Telegram endpoint returned an error");
  }

  return response.json().catch(() => ({ ok: true }));
}

async function finishInvitation() {
  const payload = {
    choice: selectedDateIdea,
    date: dateInput.value,
    dateText: formatDate(dateInput.value),
    time: timeInput.value,
    page: window.location.href,
    sentAt: new Date().toISOString()
  };

  finishBtn.disabled = true;
  sendStatus.classList.remove("is-error");
  sendStatus.textContent = "Відправляю тобі її вибір...";

  finalDate.textContent = formatDate(dateInput.value);
  finalTime.textContent = timeInput.value;
  finalChoice.textContent = selectedDateIdea;
  finalText.textContent = `Будь готова ${formatDate(dateInput.value)} о ${timeInput.value}. Я приїду за тобою, а в програмі вечора: ${selectedDateIdea.toLowerCase()}.`;

  try {
    const result = await sendTelegramChoice(payload);
    sendStatus.textContent = result.skipped ? "" : "Відправлено.";
  } catch (error) {
    sendStatus.classList.add("is-error");
    sendStatus.textContent = "Не вийшло відправити, але вибір збережений на екрані.";
  }

  showStep("answer");
  celebrate();
}

function resetInvite() {
  showStep("invite");
  noBtn.classList.remove("is-running");
  noBtn.removeAttribute("style");
  yesBtn.removeAttribute("style");
  noAttempts = 0;
  selectedDateIdea = "";
  hint.textContent = "Можна чесно натиснути “Так”. Кнопка “Ні” трохи соромиться.";
  choiceHint.textContent = "Спочатку вибери один варіант.";
  scheduleHint.textContent = "Додай дату і час, щоб зробити запрошення офіційним.";
  sendStatus.classList.remove("is-error");
  sendStatus.textContent = "";
  continueBtn.disabled = true;
  finishBtn.disabled = true;
  dateInput.value = "";
  timeInput.value = "";
  cards.forEach((card) => {
    card.classList.remove("is-selected");
    card.setAttribute("aria-checked", "false");
  });
}

noBtn.addEventListener("pointerenter", moveNoButton);
noBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveNoButton();
});

yesBtn.addEventListener("click", () => showStep("choice"));
continueBtn.addEventListener("click", () => showStep("schedule"));
finishBtn.addEventListener("click", finishInvitation);
againBtn.addEventListener("click", resetInvite);
dateInput.addEventListener("input", validateSchedule);
timeInput.addEventListener("input", validateSchedule);
cards.forEach((card) => card.addEventListener("click", () => selectCard(card)));
backButtons.forEach((button) => button.addEventListener("click", () => showStep(button.dataset.back)));
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animate();
