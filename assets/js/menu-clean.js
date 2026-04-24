document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.menu-hidden').forEach(el => {
    if (el.dataset.type !== 'plants') {
      el.style.display = 'none';
    }
  });

  // ховаємо кнопки типу Hide All / Show All (якщо хочеш)
  document.querySelectorAll('.menu-option').forEach(el => {
    if (!el.innerText.toLowerCase().includes('растения')) {
      el.style.display = 'none';
    }
  });
});
