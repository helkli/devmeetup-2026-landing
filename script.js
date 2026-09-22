// Логику менять не нужно — задача челленджа только в вёрстке/стилях (index.html, style.css).

// Обратный отсчёт до даты мероприятия
const EVENT_DATE = new Date("2026-09-25T10:00:00");

// Ниже — только оформление вывода (разметка блоков счётчика), логика расчёта не менялась.
function plural(n, forms) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
  return forms[2];
}

function countdownUnit(value, label) {
  const v = value < 10 ? String(value).padStart(2, "0") : String(value);
  return `<div class="cd-unit"><span class="cd-num">${v}</span><span class="cd-label">${label}</span></div>`;
}

function updateCountdown() {
  const now = new Date();
  const diff = EVENT_DATE - now;
  const el = document.getElementById("countdown");

  if (diff <= 0) {
    el.textContent = "Конференция уже началась!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  el.innerHTML =
    countdownUnit(days, plural(days, ["день", "дня", "дней"])) +
    countdownUnit(hours, plural(hours, ["час", "часа", "часов"])) +
    countdownUnit(minutes, plural(minutes, ["минута", "минуты", "минут"])) +
    countdownUnit(seconds, plural(seconds, ["секунда", "секунды", "секунд"]));
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Форма регистрации
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const ticket = document.getElementById("regTicket").value;

  if (!name || !email) return;

  document.getElementById("registerResult").textContent =
    `Спасибо, ${name}! Билет «${ticket}» зарезервирован, подтверждение придёт на ${email}.`;
  e.target.reset();
});

// Выбор тарифа карточками билетов → селект в форме регистрации.
// Автономный блок: логику отсчёта и отправки формы не трогает.
const ticketSelect = document.getElementById("regTicket");
const ticketForm = document.getElementById("registerForm");

function highlightTicket(value) {
  document.querySelectorAll(".ticket").forEach((card) => {
    card.classList.toggle("is-selected", Boolean(value) && card.dataset.ticket === value);
  });
}

// клик «Выбрать» на карточке: проставляем тариф и подсвечиваем карточку
document.querySelectorAll(".ticket").forEach((card) => {
  const link = card.querySelector(".btn");
  if (!link) return;
  link.addEventListener("click", () => {
    ticketSelect.value = card.dataset.ticket;
    highlightTicket(card.dataset.ticket);
  });
});

// смена тарифа прямо в селекте двигает подсветку
ticketSelect.addEventListener("change", () => highlightTicket(ticketSelect.value));

// после отправки формы выбор очищается вместе со сбросом полей
ticketForm.addEventListener("reset", () => highlightTicket(null));
