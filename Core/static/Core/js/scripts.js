
let currentNoteId = -1;
let currentBur = 1;

document.getElementById('addNote').addEventListener('click', addNote);
document.getElementById('playButton').addEventListener('click', playNotes);
document.getElementById('btnAddBar').addEventListener('click', addBar);
document.getElementById('btnPlay').addEventListener('click', play);


var myModal = new bootstrap.Modal(document.getElementById('myModal'))

// myModal.show()

function createMusicSheet() {
    const musicSheet = document.getElementById('musicSheet');

    for (let i = 0; i < 16; i++) {
        const noteInputDiv = document.createElement('div');
        noteInputDiv.className = 'note-input';

        const noteInput = document.createElement('input');
        noteInput.type = 'text';
        noteInput.className = 'note';
        noteInput.placeholder = 'Note or Chord';

        noteInputDiv.appendChild(noteInput);
        musicSheet.appendChild(noteInputDiv);
    }
}

// createMusicSheet(); // Initialize the music sheet
// let notes = []

function addNote() {
    const noteInputDiv = document.createElement('div');
    noteInputDiv.className = 'note-input';

    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.className = 'note';
    noteInput.placeholder = 'Note or Chord (e.g., A C E)';

    const durationSelect = document.createElement('select');
    durationSelect.className = 'duration';
    durationSelect.innerHTML = `
        <option value="4">Semibreve (4)</option>
        <option value="2">Minim (2)</option>
        <option value="1">Crotchet (1)</option>
        <option value="0.5">Quaver (0.5)</option>
        <option value="0.25">Semiquaver (0.25)</option>
    `;

    noteInputDiv.appendChild(noteInput);
    noteInputDiv.appendChild(durationSelect);
    document.getElementById('musicSheet').appendChild(noteInputDiv);
}

function playNotes2() {
    const noteInput = document.getElementById('noteInput').value;
    const durationInput = document.getElementById('durationInput').value;
    const tempoInput = document.getElementById('tempoInput').value;
    const notes = noteInput.split(',');
    const durations = durationInput.split(',').map(d => parseFloat(d));
    const tempo = parseInt(tempoInput, 10);

    if (isNaN(tempo) || tempo <= 0) {
        alert('Please enter a valid tempo.');
        return;
    }

    if (notes.length !== durations.length) {
        alert('Please ensure each note has a corresponding duration.');
        return;
    }

    // playNoteSequence(notes);

    playNoteSequence(notes, durations, tempo);
}


function playNotes() {
    const noteInputs = document.querySelectorAll('.note');
    const durationInputs = document.querySelectorAll('.duration');
    const tempoInput = document.getElementById('tempoInput').value;

    const notes = [];
    const durations = [];
    const tempo = parseInt(tempoInput, 10);

    noteInputs.forEach((noteInput, index) => {
        const note = noteInput.value.trim();
        const duration = parseFloat(durationInputs[index].value);
        if (note) {
            notes.push(note);
            durations.push(duration);
        }
    });

    if (isNaN(tempo) || tempo <= 0) {
        alert('Please enter a valid tempo.');
        return;
    }

    if (notes.length === 0 || durations.length === 0) {
        alert('Please enter at least one note and duration.');
        return;
    }

    playNoteSequence(notes, durations, tempo);
}


function playNoteSequence(notes, durations, tempo) {
    let index = 0;
    const baseDelay = (60 / tempo) * 1000; // Base delay for a crotchet (quarter note)

    function playNextNote() {
        if (index < notes.length) {
            // const note = notes[index].trim().toUpperCase();
            const chord = notes[index].split(' ').map(note => note.trim().toUpperCase());
            const duration = durations[index];
            const delay = baseDelay * duration; // Adjust delay based on duration


            chord.forEach(note => {
                const url = noteList[`${note}`]
                const audio = new Audio(`${url}`);
                audio.play();
            });

            // const url = noteList[`${note}`]
            // const audio = new Audio(`${url}`);
            // audio.play();
            index++;
            setTimeout(playNextNote, delay); // Set timeout for the next note
            // audio.onended = playNextNote; // Play the next note after the current one ends
        }
    }

    playNextNote(); // Start the sequence
}


/*
* Semibreve (whole note): 4
Minim (half note): 2
Crotchet (quarter note): 1
Quaver (eighth note): 0.5
Semiquaver (sixteenth note): 0.25
* */

function selectNote(noteId) {
    currentNoteId = noteId;
    $('.note').removeClass('note-selected')
    $(`#${currentNoteId}`).addClass('note-selected')

    // myModal.show()
}

document.querySelectorAll('.section').forEach(section => {
    section.addEventListener('click', function (event) {
        const sectionNumber = this.getAttribute('data-section');
        // console.log(`Section ${sectionNumber} clicked`);
        // Handle the section click as needed
        $(`#${currentNoteId}`).text(sectionNumber)
    });
});

// console.log(getBarBitCord('note-bar-1-bit-8-1'))

initSheet();

function initSheet(){
    $("#note-sheet").empty();
    console.log("empty sheet")
    addBar();
}

function addBar(){

    const barId = currentBur++;

    // console.log(barId)

    $("#note-sheet").append(`
        <div id="note-bar-${barId}" class="row border mt-1"></div>
    `);

    for (let i=1; i<=16; i++)
    {
        // console.log(i)
        let isBorder = "";
        if(i%4===0) isBorder = "border-end";

        $(`#note-bar-${barId}`).append(`
            <div class="col ${isBorder}">
                <a id="note-bar-${barId}-bit-${i}-1" href="#" onclick="selectNote('note-bar-${barId}-bit-${i}-1')" class="note">-</a>
                <br>
                <a id="note-bar-${barId}-bit-${i}-2" href="#" onclick="selectNote('note-bar-${barId}-bit-${i}-2')" class="note">-</a>
                <br>
                <a id="note-bar-${barId}-bit-${i}-3" href="#" onclick="selectNote('note-bar-${barId}-bit-${i}-3')" class="note">-</a>
            </div>
        `);
    }
}

function play(){
    console.log("start play")
    console.log(currentBur)

    const notes = [];
    const durations = [];

    for (let i=1; i<currentBur; i++){

        let barIndex = 0;
        for(let j=1; j<=16; j++){
            //console.log(`note-bar-${i}-bit-${j}-1`)
            const itemId = `note-bar-${i}-bit-${j}-1`;
            const item = `#note-bar-${i}-bit-${j}-1`;
            const val = $(item).text();

            //-- check quit in first place
            if(val === '-' && j === 1) {
                let itms = getBarBitCord(itemId);
                notes.push({
                    "note": 'N',
                    "bar": itms[0],
                    "bit": itms[1],
                    "cord": itms[2],
                    "weight": 0.25,
                    "hand": "R",
                }); //-- 'N' is quit
                barIndex++;
            }

            if(val !== '-'){
               console.log(`${itemId}: ${val}`);
                let itms = getBarBitCord(itemId);
               notes.push({
                    "note": val,
                    "bar": itms[0],
                    "bit": itms[1],
                    "cord": itms[2],
                    "weight": 0.25,
                    "hand": "R",
                });

               if(barIndex > 0){
                   console.log("prev:")
                   console.log(notes[barIndex-1]);
               }


               barIndex++;
            }

        }
    }

    console.log(notes)
}

function getBarBitCord(itemId){

    let items = itemId.split('-');
    let bar = items[2]
    let bit = items[4]
    let cord = items[5]

    return [bar,bit,cord]
}

