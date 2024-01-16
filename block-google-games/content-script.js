try {
  var games = $('div.xpdopen:contains("games")');
  games.length > 0 && games.is(":visible") && games.hide();

  var doodle = $('div.xpdopen:contains("Google doodle")');
  doodle.length > 0 && doodle.is(":visible") && doodle.hide();
} catch (s) {
  console.error(s);
}
