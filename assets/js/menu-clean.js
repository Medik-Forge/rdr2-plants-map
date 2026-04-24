function cleanMenu() {
  // 1. Прибрати всі блоки крім рослин
  document.querySelectorAll('.menu-hidden').forEach(el => {
    if (el.dataset.type !== 'plants') {
      el.style.display = 'none';
    }
  });

  // 2. Прибрати ВСІ зайві пункти (животные, события, метки і тд)
  document.querySelectorAll('.menu-option, .menu-toggle, .settings-option').forEach(el => {
    const text = el.innerText.toLowerCase();

    const allowed = [
      'растения',
      'harrietum',
      'молочай',
      'тимьян'
    ];

    const isAllowed = allowed.some(word => text.includes(word));

    if (!isAllowed) {
      el.style.display = 'none';
    }
  });
}

// запускаємо один раз
document.addEventListener('DOMContentLoaded', cleanMenu);

// 🔥 головне — слідкуємо за динамікою
const observer = new MutationObserver(() => {
  cleanMenu();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
