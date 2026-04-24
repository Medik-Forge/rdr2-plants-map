document.addEventListener('DOMContentLoaded', () => {
  const allowedPlants = [
    "milkweed",
    "oleander",
    "burdock_root",
    "thyme",
    "berlandiera",
    "harietum_officinalis",
    "lobelia",
    "asclepias",
    
    // орхідеї (додамо пізніше)
    "acunas_star_orchid",
    "cigar_orchid",
    "shell_orchid",
    "dragon_mouth_orchid",
    "ghost_orchid",
    "night_scented_orchid",
    "lady_of_the_night_orchid",
    "sparrow_egg_orchid",
    "rat_tail_orchid",
    "blue_lady_orchid",
    "spider_orchid"
  ];

  // Чекаємо поки карта завантажиться
  const waitForMap = setInterval(() => {
    if (window.MapBase && MapBase.markers) {
      clearInterval(waitForMap);

      // 🔥 ФІЛЬТР МІТОК
      MapBase.markers.forEach(marker => {
        if (marker.category === 'plants') {
          if (!allowedPlants.includes(marker.text)) {
            marker.remove(); // ховаємо зайві
          }
        }
      });

      console.log("Plants filtered");
    }
  }, 500);
});
