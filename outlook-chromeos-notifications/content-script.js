try {
  setInterval(() => {
    let count = 0;

    try {
      try {
        document.querySelector('div[title~="Inbox"]').querySelectorAll('span[class="screenReaderOnly"]').forEach(function (v, i) {
          if (v.innerText == "unread") {
            count = parseInt(v.parentElement.firstChild.innerText, 10);
          }
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
