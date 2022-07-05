/**
 *
 * wrapper for fetch function
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

/**
 *
 * Shows an alert, used with acFetch
 * @param {String} alert The alert message
 * @param {Boolean} error True if error, will display in red
 */
function showAlert(alert, error = false) {
  if (document.querySelector("#tempAlert")) {
    document.querySelector("#tempAlert").remove();
  }
  var red = "";
  if (error) {
    red = " red";
  }
  document.querySelector("body").innerHTML +=
    '<div id="tempAlert" onclick="document.querySelector("#tempAlert").remove()" class="tempAlert' +
    red +
    '">' +
    alert +
    "</div>";
  document.querySelector("#tempAlert").style.opacity = 1;
  document.querySelector("#tempAlert").style.zIndex = 101;
  setTimeout(function () {
    document.querySelector("#tempAlert").style.opacity = 0;
    setTimeout(function () {
      document.querySelector("#tempAlert").remove();
    }, 3000);
  }, 3000);
}

/**
 *
 * @param {String} title The printed title of the form
 * @param {String} htmlClass A class to apply for styling
 * @param {String} submitFunction The name of a function to call for submitting the form
 * @param {Array} items An array of items consisting of objects of the form {label: String, type: String}, where type is an input type
 */
function displayForm(title, htmlClass, submitFunction, items) {
  //All parameters are required
  if (
    typeof title == "undefined" ||
    typeof htmlClass == "undefined" ||
    typeof submitFunction == "undefined" ||
    typeof items == "undefined"
  ) {
    return "Error in displayForm parameters";
  }
  //Remove any existing modal forms
  if (document.querySelector(".shadow")) {
    document.querySelector(".shadow").remove();
  }
  //The submitFunction needs to end with parentheses
  if (
    submitFunction.substring(
      submitFunction.length - 2,
      submitFunction.length
    ) != "()"
  ) {
    submitFunction += "()";
  }
  //Create the form
  var htmlString = "";
  htmlString +=
    `
  <div class="shadow">
    <div class="modalForm ` +
    htmlClass +
    `">
      <div class="modalFormTitle">` +
    title +
    `</div>
      <div class="formElements">`;
  items.forEach(function (item, index) {
    //Each form label should end in a colon
    if (item.label.substring(item.label.length - 1, item.label.length) != ":") {
      item.label += ":";
    }
    htmlString +=
      `
      <div class="modalFormRow">      
      <label for="` +
      htmlClass +
      index +
      `">` +
      item.label +
      `</label>
            <input id="` +
      item.id +
      `"type="` +
      item.type +
      `"/>
      </div>
          `;
  });
  htmlString +=
    `
        <input type="submit" onclick="` +
    submitFunction +
    `"></input>
      </div>
    </div>
  </div>
  `;
  document.querySelector("body").innerHTML += htmlString;
}

/**
 *
 * @param {Array} plans An array of Plans
 * @return {Array} Returns an array of steps
 */
function sortPlanActions(plans) {
  var stepArray = [];
  plans.forEach(function (plan) {
    plan.steps.forEach(function (step) {
      stepArray.push(step);
    });
  });
  stepArray.sort(function (a, b) {
    return a.date - b.date;
  });
  return stepArray;
}
