document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // знайти ВСІ секції меню
    document.querySelectorAll('.menu-hidden').forEach(section => {
      const title = section.innerText.toLowerCase();

      // залишаємо тільки "растения"
      if (!title.includes('растения')) {
        section.style.display = 'none';
      }
    });

    // ховаємо зайві кнопки
    document.querySelectorAll('.menu-option').forEach(el => {
      const text = el.innerText.toLowerCase();

      if (
        text.includes('живот') ||
        text.includes('преступ') ||
        text.includes('событ') ||
        text.includes('мисси') ||
        text.includes('дополн')
      ) {
        el.style.display = 'none';
      }
    });

  }, 1000); // чекаємо поки меню прогрузиться
});
