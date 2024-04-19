const noteInput = document.querySelector("#note-content"); // input de criar nota

const addNotaBtn = document.querySelector(".add-note"); // Button add Nota

const notesContainer = document.querySelector("#notes-container"); // Notas Criadas

const searchInput = document.querySelector("#search-input"); // Input de Busca de nota

//Evento de Buscar nota
searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  searchNotes(search);
});

//função de busca
function searchNotes(search) {
  const searchResults = getNotes().filter((note) => {
    return note.content.includes(search);
  });

  if (search !== "") {
    cleanNotes();

    searchResults.forEach((note) => {
      const noteElement = createNote(note.id, note.content);
      notesContainer.appendChild(noteElement);
    });
    return;
  }

  cleanNotes();

  showNotes();
}

//Evento criar nota
addNotaBtn.addEventListener("click", () => addNote());

//Evento criar nota com Enter
noteInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter") {
    addNote();
  }
})

// Função add Nota
function addNote() {
  const noteObject = {
    id: generateId(),
    content: noteInput.value,
    fixed: false,
  };

  const noteElement = createNote(noteObject.id, noteObject.content);

  notesContainer.appendChild(noteElement);

  // LocalStorage
  const notes = getNotes();

  notes.push(noteObject);
  saveNotes(notes);

  noteInput.value = "";
}

//função gerar ID auto
function generateId() {
  return Math.floor(Math.random() * 5000);
}

//função criar nota
function createNote(id, content, fixed) {
  const element = document.createElement("div");
  element.classList.add("note");

  // Add texto da nota
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Adicione algum texto";
  textarea.value = content;

  element.appendChild(textarea);

  // Add Icon delete nota
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add(...["bi", "bi-x-lg"]);

  element.appendChild(deleteIcon);

  //Evento delete Nota
  element.querySelector(".bi-x-lg").addEventListener("click", () => {
    deleteNote(id, element);
  });

  //Função deletar nota
  function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id !== id);

    saveNotes(notes);
    notesContainer.removeChild(element);
  }

  // Add Icon duplique nota
  const duplicateIcon = document.createElement("i");
  duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);

  element.appendChild(duplicateIcon);

  //Evento duplique nota
  element
    .querySelector(".bi-file-earmark-plus")
    .addEventListener("click", () => {
      copyNote(id);
    });

  //Função duplicar nota
  function copyNote(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    const noteObject = {
      id: generateId(),
      content: targetNote.content,
      fixed: false,
    };

    const noteElement = createNote(
      noteObject.id,
      noteObject.content,
      noteObject.fixed
    );

    notesContainer.appendChild(noteElement);

    notes.push(noteObject);
    saveNotes(notes);
  }

  // Add Icon fixed nota
  const pinIcon = document.createElement("i");
  pinIcon.classList.add(...["bi", "bi-pin"]);

  element.appendChild(pinIcon);

  if (fixed) {
    element.classList.add("fixed");
  }

  // Evento fixed notas
  element.querySelector(".bi-pin").addEventListener("click", () => {
    toggleFixedNote(id);
  });
  // Função fixed LocalStorage false/true
  function toggleFixedNote(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];
    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);

    showNotes();
  }

  return element;
}

// Salvando LocalStorage
function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// buscando Notas LocalStorage
function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1)); // Ordenando as notas fixas

  return orderedNotes;
}

// Função Exibir Notas LocalStorage
function showNotes() {
  cleanNotes();

  getNotes().forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed);

    notesContainer.appendChild(noteElement);
  });
}

//Função limpar notas LocalStorage
function cleanNotes() {
  notesContainer.replaceChildren([]);
}

// Inicialização
showNotes();

// EXPORTANDO CSV
const exportBtn = document.querySelector("#export-notes")

// Evento export CSV
exportBtn.addEventListener("click", () => {
  exportData()
})

// Função CSV
function exportData() {

  const notes = getNotes()

  const csvString = [
    ["ID", "Conteúdo", "Fixado?"],
    ...notes.map((note) => [note.id, note.content, note.fixed]),
  ].map((e) => e.join(",")).join("\n");

  const element = document.createElement("a")

  element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

  element.target = "_blank"

  element.download = "notes.csv"

  element.click();
}