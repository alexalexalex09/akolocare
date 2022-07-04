/*****************************/
/*         acFetch()        */
/*****************************/
/**
 *
 *
 * @param {String} req Address of POST request beginning with slash
 * @param {Object} body Object to be JSON.stringify'd
 * @param {Function} handler format is (res) => {function body}
 * @param {Function} errorHandler (optional) Error handler
 */
function acfetch(req, body, handler, errorHandler) {
  if (body === "") {
    body = {};
  }
  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(req, options).then(function (response) {
    return response.json().then((res) => {
      if (res.err) {
        if (errorHandler) {
          errorHandler(res);
        } else {
          showAlert(res.err);
        }
      } else {
        handler(res);
      }
    });
  });
  return;
  //Return here? So that it's non-blocking?
}

function showAlert(alert, error = false) {
  $("#tempAlert").remove();
  var red = "";
  if (error) {
    red = " red";
  }
  $("body").append(
    '<div id="tempAlert" onclick="$(this).remove()" class="tempAlert' +
      red +
      '">' +
      alert +
      "</div>"
  );
  $("#tempAlert").css({ opacity: 1, "z-index": 101 });
  setTimeout(function () {
    $("#tempAlert").css({ opacity: 0 });
    setTimeout(function () {
      $("#tempAlert").remove();
    }, 3000);
  }, 3000);
}
