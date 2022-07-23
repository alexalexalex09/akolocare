window.addEventListener("load", function () {
  //TODO: Get all CRs from local storage first and then replace when this function returns?
  acfetch("/r/getAllCRs", "", function (res) {
    displayCRs(res);
  });
});

//Used by dashboard view to display all CRs upon load
function displayCRs(crs) {
  var htmlString = ""; //create an empty var to fill
  htmlString += `
  <div class="crRow" id="crDisplayTitleRow">
    <div class="crFirstName">First Name</div>
    <div class="crLastName">Last Name</div>
    <div class="crActions">Actions</div>
    <div class="crEdit">Edit</div>
  </div>
  ${eachHTML(crs, insertCrRow)}
  `;
  function insertCrRow(cr) {
    return `
    <div class="crRow" id="${cr._id}">
      <div class="crFirstName">${cr.firstName}</div>
      <div class="crlastName">${cr.lastName}</div>
      <div class="crActions">
        <span class="crActionsTitle" onclick="toggleActionsExpand()">📝</span>
        <div class="crActionsExpand crNotesUnexpanded hidden" >
          ${eachHTML(sortCRPlans(cr.plans), insertCrSteps)}
        </div> <!--crActionsExpand-->
      </div> <!--crActions-->
      <span class="crEdit" onclick="toggleEdit()">✏️</span>
      <div class="crEditForm hidden">
        <div class="crFirstName">${cr.firstName}</div>
        <div class="crlastName">${cr.lastName}</div>
        <div class="crNotes">
          <div class="crNotesTitle" onclick="toggleNotesExpand()">Notes</div>
          <div class="crNotesExpand crNotesUnexpanded hidden" >
            ${eachHTML(cr.notes, insertCRNotes)}
          </div> <!--crNotesExpand-->
        </div> <!--crNotes-->
      </div> <!--crEditForm-->
    </div> <!--crRow-->`;
  }
  document.querySelector("#crDisplay").innerHTML = htmlString;
  //TODO: toggleNotesExpand();
  //TODO: displayCRActions();
  //TODO: css for above
}
function insertCRNotes(note) {
  //insert each note into its own hidden row to be displayed later
  return `<div class="crNote">${note.note}</div>
          <div class="crNoteDate">${note.date}</div>`;
}

function sortCRPlans(plans) {
  if ((plans.length = 0)) {
    return [];
  } else {
    return plans;
  }
}

function insertCrSteps(step) {
  return `<div class="crStep">
            <div class="stepName">${step.name}${step.required ? `*` : ``}</div>
            <div class="stepDate">${step.date}</div>
            <div class="stepCompleted">${step.completed}</div>
          </div>`; //crStep
}

//function to begin the CR creation process upon button click
//This will display a modal form to fill out and submit
function createCR() {
  const title = "Create a new Care Receiver";
  const htmlClass = "createCR";
  const submitFunction = "submitNewCR";
  const items = [
    { label: "First Name:", type: "text", id: "createCRFirstName" },
    { label: "Last Name:", type: "text", id: "createCRLastName" },
  ];
  displayForm(title, htmlClass, submitFunction, items);
}

function createTemplate() {
  const title = "Create a new Template";
  const htmlClass = "createTemplate";
  const submitFunction = "submitNewTemplate";
  const items = [
    { label: "Template Name:", type: "text", id: "createTemplateName" },
    {
      label: "Description:",
      type: "textarea",
      id: "createTemmplateDescription",
    },
  ];
  displayForm(title, htmlClass, submitFunction, items);
}

function submitNewCR() {
  const firstName = document.querySelector("#createCRFirstName").value;
  const lastName = document.querySelector("#createCRLastName").value;
  closeModal();
  acfetch(
    "/r/createCR",
    {
      firstName: firstName,
      lastName: lastName,
    },
    function (res) {
      console.log(res);
      showAlert("Created CR Successfully!");
    }
  );
}
