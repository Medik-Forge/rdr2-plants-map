document.addEventListener('DOMContentLoaded', () => {

  // ❌ Ховаємо всі категорії крім рослин
  document.querySelectorAll('.menu-hidden').forEach(el => {
    if (el.dataset.type !== 'plants') {
      el.style.display = 'none';
    }
  });

  // ❌ Ховаємо нижні блоки (животные, события і т.д.)
  document.querySelectorAll('.menu-option, .links-container, .menu-ad').forEach(el => {
    el.style.display = 'none';
  });

  // ❌ Ховаємо кнопки
  document.querySelectorAll('.menu-hidden .menu-option').forEach(el => {
    el.style.display = 'none';
  });

  // ❌ Ховаємо текст-підказку внизу
  const help = document.querySelector('.menu-hidden .menu-help');
  if (help) help.style.display = 'none';

});
