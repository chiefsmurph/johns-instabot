var scrollDiv = document.querySelector('[role="dialog"] > div > div > div:nth-child(2)');
var scrolls = [];

function scrollFollowers(cb) {

  (function scrollIt() {
    var beforeHeight = scrollDiv.scrollHeight;
    scrolls.push(beforeHeight);
    setTimeout(function() {
      var nowHeight = scrollDiv.scrollHeight;
      if (nowHeight === beforeHeight) {
        cb(scrolls);
      } else {
        scrollIt();
      }
    }, 3000);
    $(scrollDiv).scrollTop(currentHeight);
  })();

}
