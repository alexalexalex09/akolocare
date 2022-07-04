window.addEventListener("load", function () {
  acfetch("/getAllCRs", "", function (res) {
    displayCRs();
  });
});
