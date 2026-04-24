document.addEventListener('DOMContentLoaded', () => {

  // ❌ ховаємо ВСІ секції крім plants
  document.querySelectorAll('.menu-hidden').forEach(el => {
    if (el.dataset.type !== 'plants') {
      el.style.display = 'none';
    }
  });

  // ❌ ховаємо ВСІ текстові категорії (Животные, преступники і т.д.)
  document.querySelectorAll('.menu-option').forEach(el => {
    el.style.display = 'none';
  });

  // ❌ ховаємо нижні блоки (події)
  document.querySelectorAll('.links-container').forEach(el => {
    el.style.display = 'none';
  });

  // ❌ ховаємо підказку
  document.querySelectorAll('.menu-help').forEach(el => {
    el.style.display = 'none';
  });

  // ❌ ховаємо рекламу
  document.querySelectorAll('.menu-ad').forEach(el => {
    el.style.display = 'none';
  });

});
