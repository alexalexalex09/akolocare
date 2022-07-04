window.addEventListener("load", function () {
  acfetch("/r/getAllCRs", "", function (res) {
    displayCRs();
  });
});
