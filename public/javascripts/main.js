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
 * A higher-order function that takes an array of items, a
 * function that will be called on each item, and other parameters
 * that will be passed through to that function. The format for the
 * function fn is:
 * function (item, index, extraParam1, extraParam2) {
 *  //Some operation on item and extraParams
 *  return HTML string
 * }
 *
 * @param {Array} items the items to be iterated through
 * @param {Function} fn the function to apply to the items
 * @param {*} optional other parameters will be passed through
 * @returns {String} a string of HTML
 */
function eachHTML(items, fn) {
  html = "";
  var [items, fn, ...args] = arguments;
  items.forEach(function (item, index) {
    html += fn(item, index, ...args);
  });
  return html;
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
  htmlString += `
  <div class="shadow">
    <div class="modalForm ${htmlClass}">
      <div class="modalFormTitle">
        <div class="modalFormTitleText"> ${title}</div>
        <div class="modalFormX" onclick="closeModal()">🗙</div>
      </div>
      <div class="formElements">
        ${eachHTML(items, modalFormRow, htmlClass)}
        <input type="submit" onclick="${submitFunction}"></input>
      </div>
    </div>
  </div>
  `;
  document.querySelector("body").innerHTML += htmlString;
  document.querySelectorAll(".modalFormRow")[0].querySelector("input").focus();
}

function closeModal() {
  document.querySelector(".shadow").remove();
}

/**
 * Creates a row for the modal form, to be called by eachHTML()
 * @param {*} item the item from the array
 * @param {Number} index the index of that item
 * @param {String} htmlClass the form's html class
 * @returns html String
 */
function modalFormRow(item, index, htmlClass) {
  if (item.label.substring(item.label.length - 1, item.label.length) != ":") {
    item.label += ":";
  }
  return `<div class="modalFormRow">      
            <label for="${htmlClass + index}">${item.label}</label>
            <input id="${item.id}" type="${item.type}"/>
          </div>`;
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
