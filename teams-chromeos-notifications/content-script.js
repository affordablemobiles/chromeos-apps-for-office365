try {
  setInterval(() => {
    try {
      let count = 0;

      try {
        document.querySelectorAll('span[class="activity-badge"]').forEach(function (v, i) {
          count += parseInt(v.innerText, 10);
        });
      } catch (e) {
        //
      }

      navigator.setAppBadge(count);
    } catch (e) {
      console.error(e);
    }
  }, 250);
} catch (s) {
  console.error(s);
}
