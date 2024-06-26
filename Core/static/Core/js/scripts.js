let currentNoteId = null;
let currentBur = 1; //-- bar number
let isPlaying = false

// document.getElementById('addNote').addEventListener('click', addNote);
// document.getElementById('playButton').addEventListener('click', playNotes);
document.getElementById('btnAddBar').addEventListener('click', addBar);
document.getElementById('btnPlay').addEventListener('click', play);


var myModal = new bootstrap.Modal(document.getElementById('myModal'))

// myModal.show()
/*
*
* */
document.addEventListener('keydown', function(event) {

    console.log(currentNoteId)
    if(currentNoteId == null) return;

    // console.log(event.keyCode)

    switch (event.keyCode){
        //-- "1"
        case 49:
            $(`#${currentNoteId}`).text(1);
            break;
        //-- "2"
        case 50:
            $(`#${currentNoteId}`).text(2);
            break;
        //-- "3"
        case 51:
            $(`#${currentNoteId}`).text(3);
            break;
        //-- "4"
        case 52:
            $(`#${currentNoteId}`).text(4);
            break;
        //-- "5"
        case 53:
            $(`#${currentNoteId}`).text(5);
            break;
        //-- "6"
        case 54:
            $(`#${currentNoteId}`).text(6);
            break;
        //-- "7"
        case 55:
            $(`#${currentNoteId}`).text(7);
            break;
        //-- "8"
        case 56:
            $(`#${currentNoteId}`).text(8);
            break;
        //-- "D"
        case 68:
            $(`#${currentNoteId}`).text('D');
            break;
        //-- "Left Arrow"
        case 37:
            selectNote(leftIndex(currentNoteId));
            break;
        //-- "Right Arrow"
        case 39:
            selectNote(rightIndex(currentNoteId));
            break;
        //-- "Down Arrow"
        case 40:
            selectNote(upIndex(currentNoteId));
            break;
        //-- "Up Arrow"
        case 38:
            selectNote(downIndex(currentNoteId));
            break;
    }


});

function rightIndex(noteId){
    if(noteId == null) return "";
    let items = getBarBitCord(noteId)
    let bar = parseInt(items[0])
    let bit = parseInt(items[1])
    let chord = parseInt(items[2])

    if(bit < 16) bit++;
    else if(bit === 16){
        if(currentBur > 1){
            bit = 1;
            bar++;
        }
    }

    let newId = `note-bar-${bar}-bit-${bit}-${chord}`;

    return newId;
}

function leftIndex(noteId){
    if(noteId == null) return "";
    let items = getBarBitCord(noteId)
    let bar = parseInt(items[0])
    let bit = parseInt(items[1])
    let chord = parseInt(items[2])

    if(bit > 1) bit--;
    else if(bit === 1){
        if(bar > 1){
            bit = 16;
            bar--;
        }
    }

    let newId = `note-bar-${bar}-bit-${bit}-${chord}`;

    return newId;
}

function downIndex(noteId){
    if(noteId == null) return "";
    let items = getBarBitCord(noteId)
    let bar = parseInt(items[0])
    let bit = parseInt(items[1])
    let chord = parseInt(items[2])

    if(chord > 1) chord--;
    else if(bar > 1){
        bar--;
        chord = 3;
    }

    let newId = `note-bar-${bar}-bit-${bit}-${chord}`;

    return newId;
}

function upIndex(noteId){
    if(noteId == null) return "";
    let items = getBarBitCord(noteId)
    let bar = parseInt(items[0])
    let bit = parseInt(items[1])
    let chord = parseInt(items[2])

    if(chord < 3) chord++;
    else if(bar < currentBur - 1){
        bar++;
        chord = 1;
    }

    let newId = `note-bar-${bar}-bit-${bit}-${chord}`;

    return newId;
}



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

function playNoteSequenceJson(notes, tempo) {

    changePlayButton(true);

    let index = 0;
    const baseDelay = (60 / tempo) * 1000; // Base delay for a crotchet (quarter note)

    function playNextNote() {
        if (index < notes.length) {
            // const note = notes[index].trim().toUpperCase();
            // const chord = notes[index].split(' ').map(note => note.trim().toUpperCase());
            const chord = notes[index].cord;

            const duration = notes[index].weight;
            const delay = baseDelay * duration; // Adjust delay based on duration

            chord.forEach(item => {
                let noteMapping = item.note;
                if(noteMapping === "N") return;
                // console.log("noteMapping:"+noteMapping)
                const url = noteList[`${noteMapping}`]
                // console.log(url)
                const audio = new Audio(`${url}`);
                audio.play();
            });

            index++;
            setTimeout(playNextNote, delay); // Set timeout for the next note
            // audio.onended = playNextNote; // Play the next note after the current one ends
        }
        else{
            changePlayButton(false);
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
    $('.note').parent().removeClass('note-selected')
    // $(`#${currentNoteId}`).addClass('note-selected')
    $(`#${currentNoteId}`).parent().addClass('note-selected')
        // myModal.show()
}

document.querySelectorAll('.section').forEach(section => {
    section.addEventListener('click', function (event) {
        const sectionNumber = this.getAttribute('data-section');
        // console.log(`Section ${sectionNumber} clicked`);
        // Handle the section click as needed
        $(`#${currentNoteId}`).text(sectionNumber);
        $('.note').parent().removeClass('note-selected')
        currentNoteId = null;
    });
});

// console.log(getBarBitCord('note-bar-1-bit-8-1'))

initSheet();

function initSheet() {
    $("#note-sheet").empty();
    console.log("empty sheet")
    addBar();
}

function addBar() {

    const barId = currentBur++;

    // console.log(barId)

    $("#note-sheet").append(`
        <div id="note-bar-${barId}" class="row border rounded mt-1"></div>
    `);

    for (let i = 1; i <= 16; i++) {
        // console.log(i)
        let isBorder = "";
        if (i % 4 === 0) isBorder = "border-end";

        $(`#note-bar-${barId}`).append(`
            <div class="col ${isBorder}">
                <div class="d-flex justify-content-center "><a id="note-bar-${barId}-bit-${i}-1" href="#" onclick="selectNote('note-bar-${barId}-bit-${i}-1')" class="note">-</a></div>
                <div class="d-flex justify-content-center"><a id="note-bar-${barId}-bit-${i}-2" href="#" onclick="selectNote('note-bar-${barId}-bit-${i}-2')" class="note">-</a></div>
                <div class="d-flex justify-content-center"><a id="note-bar-${barId}-bit-${i}-3" href="#" onclick="selectNote('note-bar-${barId}-bit-${i}-3')" class="note">-</a></div>
            </div>
        `);
    }
}

function play() {
    console.log("start play")
    console.log(currentBur)

    const notes = [];
    const durations = [];

    let barIndex = 0;

    function processCord(i, j, cordId) {
        //console.log(`note-bar-${i}-bit-${j}-1`)
        const itemId = `note-bar-${i}-bit-${j}-${cordId}`;
        const item = `#note-bar-${i}-bit-${j}-${cordId}`;
        const val = $(item).text();

        //-- check quit in first place
        if (val === '-' && j === 1 && cordId === 1) {
            let itms = getBarBitCord(itemId);
            if(itms[0] === '1') return {
                "note": 'N',
                "bar": itms[0],
                "bit": itms[1],
                "cord": itms[2],
                "weight": 4,
                "hand": "R",
            }; //-- 'N' is quit
        }

        if (val !== '-') {
            //console.log(`${itemId}: ${val}`);
            let itms = getBarBitCord(itemId);
            return {
                "note": val,
                "bar": itms[0],
                "bit": itms[1],
                "cord": itms[2],
                "weight": 4,
                "hand": "R",
            };
        }

        return null;
    }

    for (let i = 1; i < currentBur; i++) {

        for (let j = 1; j <= 16; j++) {
            let chord1 = processCord(i, j, 1)
            let chord2 = processCord(i, j, 2)
            let chord3 = processCord(i, j, 3)

            /*if(chord1){console.log("chord1:")
            console.log(chord1)}
            if(chord2){console.log("chord2:")
            console.log(chord2)}
            if(chord3){console.log("chord3:")
            console.log(chord3)}*/

            let newNote = null;
            if (chord1 !== null) {
                newNote = {
                    "bar": chord1.bar,
                    "bit": chord1.bit,
                    "weight": chord1.weight,
                    "cord": [
                        {
                            "note": chord1.note,
                            "hand": chord1.hand,
                        }
                    ]
                };
            }

            if (chord2 !== null) {
                newNote.cord.push({
                    "note": chord2.note,
                    "hand": chord2.hand,
                })
            }

            if (chord3 !== null) {
                newNote.cord.push({
                    "note": chord3.note,
                    "hand": chord3.hand,
                })
            }

            if (newNote != null) {

                notes.push(newNote);
                const currentBarIndex = barIndex++;

                if (currentBarIndex > 0) {
                    const prevNote = notes[currentBarIndex - 1];
                    let diffBit = 0;
                    //-- for same bar
                    if(prevNote.bar === chord1.bar) diffBit = parseInt(chord1.bit) - parseInt(prevNote.bit);
                    //-- for diff bar
                    else{
                        let prevDiffToEndBit = 16 - parseInt(prevNote.bit);
                        let diffBar = (parseInt(chord1.bar) - parseInt(prevNote.bar) - 1) * 16;
                        diffBit = parseInt(chord1.bit) + prevDiffToEndBit + diffBar;
                    }

                    notes[currentBarIndex - 1].weight = 0.25 * diffBit;
                }

            }

        }
    }

    console.log(notes)
    playNoteSequenceJson(notes, 120);
}

function getBarBitCord(itemId) {

    let items = itemId.split('-');
    let bar = items[2]
    let bit = items[4]
    let cord = items[5]

    return [bar, bit, cord]
}

function changePlayButton(is_play){
    isPlaying = is_play
    console.log(is_play)
    if(is_play !== true){
        $("#btnPause").addClass('d-none')
        $("#btnPlay").removeClass('d-none')
    }
    else{
        $("#btnPause").removeClass('d-none')
        $("#btnPlay").addClass('d-none')
    }
}