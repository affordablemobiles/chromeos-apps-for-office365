try {
  setInterval(() => {
    let count = 0;

    try {
      try {
        document.querySelector('div[role="navigation"]').querySelectorAll('span[aria-hidden="true"]').forEach(function (v, i) {
          if (v.innerText != "") {
            count += parseInt(v.innerText, 10);
          }
        });
      } catch (e) {
        //
      }

      // console.log("Notification count: " + count);

      navigator.setAppBadge(count);
    } catch (e) {
      console.error(e);
    }
  }, 250);
} catch (s) {
  console.error(s);
}
