window.addEventListener("load", function () {
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
    <div class="crNotes">Notes</div>
    <div class="crDisplayActions">Actions</div>
  </div>
  `;
  crs.forEach(function (cr, index) {
    //build a row out of each cr
    htmlString +=
      `
    <div class="crRow" id="` +
      cr._id +
      `">
      <div class="crFirstName">` +
      cr.firstName +
      `</div>
      <div class="crlastName">` +
      cr.lastName +
      `</div>
      <div class="crEdit">✏️</div>
      <div class="crEditForm hidden>
        <div class="crFirstName">` +
      cr.firstName +
      `</div>
        <div class="crlastName">` +
      cr.lastName +
      `</div>
        <div class="crNotes">
          <div class="crNotesTitle" onclick="toggleNotesExpand()">Notes</div>
          <div class="crNotesExpand crNotesUnexpanded hidden" >`;
    cr.notes.forEach(function (note) {
      //insert each note into its own hidden row to be displayed later
      htmlString +=
        `   <div class="crNote">` +
        note.note +
        `   </div>
            <div class="crNoteDate">` +
        note.date +
        `   </div>`;
    });
    htmlString +=
      `   </div>` + //crNotesExpand
      ` </div>` + //crNotes
      ` <div class="crActions>
          <div class="crActionsTitle" onclick="toggleActionsExpand()">Actions</div>
          <div class="crActionsExpand crNotesUnexpanded hidden" >`;
    const steps = sortCRPlans(cr.plans); //Get all the action steps in chronological order
    steps.forEach(function (step) {
      htmlString +=
        `   <div class="crStep">
              <div class="stepName">` + step.name;
      htmlString += step.required ? `*` : ``;
      htmlString +=
        `     </div>
              <div class="stepDate">` +
        step.date +
        `     </div>
              <div class="stepCompleted">` +
        step.completed +
        `     </div>
            </div>`; //crStep
    });
    htmlString +=
      `    </div>` + //crActionsExpand
      `  </div>` + //crActions
      `</div>` + //crEditForm
      `</div>`; //crRow
  });
  document.querySelector("#crDisplay").innerHTML = htmlString;
  //TODO: toggleNotesExpand();
  //TODO: displayCRActions();
  //TODO: css for above
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

function submitNewCR() {
  acfetch(
    "/r/createCR",
    {
      firstName: document.querySelector("#createCRFirstName").value,
      lastName: document.querySelector("#createCRLastName").value,
    },
    function (res) {
      console.log(res);
      showAlert("Created CR Successfully!");
    }
  );
}
