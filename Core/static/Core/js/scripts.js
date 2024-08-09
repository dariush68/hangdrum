let currentNoteId = null;
let currentBur = 1; //-- bar number
let isPlaying = false
let isViewMode = true
let currentPlayIndex = 0;
let pauseInterrupt = false;
let selectedSheetNotes = null
let isLoopActive = false
let isRepeatOne = true

let loopStartIndex = null
let loopEndIndex = null

document.getElementById('btnAddBar').addEventListener('click', addBar);
document.getElementById('btnPlay').addEventListener('click', play);
document.getElementById('btnPause').addEventListener('click', pause);


var myModal = new bootstrap.Modal(document.getElementById('myModal'))
var modalSaveSheet = new bootstrap.Modal(document.getElementById('modalSaveSheet'))

//-- check sheet is selected for loading
function CheckSelectedSheet() {
    if (selectedSheet != null) {
        // console.log("selectedSheet")
        // console.log(selectedSheet)

        //-- provide note json data
        // selectedSheetNotes = sheet2json();
        // console.log(selectedSheetNotes)

        //-- draw sheet
        const sheetJson = JSON.parse(selectedSheet.sheet)
        // console.log(sheetJson)

        $('#sheet-info').empty().append(`${selectedSheet.title}`)

        const maxBarCount = parseInt(sheetJson[sheetJson.length - 1].bar);
        //console.log(maxBarCount)

        $("#note-sheet").empty();
        $("#note-sheet-view").empty();
        currentBur = 1;
        for (let i = 1; i <= maxBarCount; i++) {
            addBar();
        }

        //-- set notes
        for (let i = 0; i < sheetJson.length; i++) {
            //console.log(`----${i}------`)
            //console.log(sheetJson[i])
            //note-bar-2-bit-1-1
            if (sheetJson[i].cord[0] !== undefined) {
                const cord_1 = `note-bar-${sheetJson[i].bar}-bit-${sheetJson[i].bit}-1`;
                $(`#${cord_1}`).text(sheetJson[i].cord[0].note);
                //console.log(cord_1)

                const cord_view_1 = `note-view-bar-${sheetJson[i].bar}-bit-${sheetJson[i].bit}-1`;
                $(`#${cord_view_1}`).text(sheetJson[i].cord[0].note);

                if(sheetJson[i].cord[0].hand === "L") {
                    $(`#${cord_1}`).addClass('note-left-hand')
                    $(`#${cord_view_1}`).addClass('note-left-hand')
                }
            }
            if (sheetJson[i].cord[1] !== undefined) {
                const cord_2 = `note-bar-${sheetJson[i].bar}-bit-${sheetJson[i].bit}-2`;
                $(`#${cord_2}`).text(sheetJson[i].cord[1].note);
                //console.log(cord_2)
                const cord_view_2 = `note-view-bar-${sheetJson[i].bar}-bit-${sheetJson[i].bit}-2`;
                $(`#${cord_view_2}`).text(sheetJson[i].cord[1].note);

                if(sheetJson[i].cord[1].hand === "L") {
                    $(`#${cord_2}`).addClass('note-left-hand')
                    $(`#${cord_view_2}`).addClass('note-left-hand')
                }
            }
            if (sheetJson[i].cord[2] !== undefined) {
                const cord_3 = `note-bar-${sheetJson[i].bar}-bit-${sheetJson[i].bit}-3`;
                $(`#${cord_3}`).text(sheetJson[i].cord[2].note);
                //console.log(cord_3)
                const cord_view_3 = `note-view-bar-${sheetJson[i].bar}-bit-${sheetJson[i].bit}-3`;
                $(`#${cord_view_3}`).text(sheetJson[i].cord[2].note);

                if(sheetJson[i].cord[2].hand === "L") {
                    $(`#${cord_3}`).addClass('note-left-hand')
                    $(`#${cord_view_3}`).addClass('note-left-hand')
                }
            }
            // $(`#note-bar-${sheetJson[i].bar}-bit-${sheetJson[i].bit}-${sheetJson[i].cord[0]}`)
        }

        //-- provide note json data
        selectedSheetNotes = sheet2json();
        // console.log(selectedSheetNotes)

        //-- add logic for loop managing
        manageLoopHandler();
    }

}


// myModal.show()
/*
*
* */
document.addEventListener('keydown', function (event) {

    if (currentNoteId == null) return;

    // console.log(currentNoteId)

    console.log(event.keyCode)
    // console.log(event.shiftKey)

    switch (event.keyCode) {
        //-- "1"
        case 49:
            $(`#${currentNoteId}`).text(1);
            if(event.shiftKey)$(`#${currentNoteId}`).addClass('note-left-hand')
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


}, true);

function rightIndex(noteId) {
    if (noteId == null) return "";
    let items = getBarBitCord(noteId)
    let bar = parseInt(items[0])
    let bit = parseInt(items[1])
    let chord = parseInt(items[2])

    if (bit < 16) bit++;
    else if (bit === 16) {
        if (currentBur > 1) {
            bit = 1;
            bar++;
        }
    }

    let newId = `note-bar-${bar}-bit-${bit}-${chord}`;

    return newId;
}

function leftIndex(noteId) {
    if (noteId == null) return "";
    let items = getBarBitCord(noteId)
    let bar = parseInt(items[0])
    let bit = parseInt(items[1])
    let chord = parseInt(items[2])

    if (bit > 1) bit--;
    else if (bit === 1) {
        if (bar > 1) {
            bit = 16;
            bar--;
        }
    }

    let newId = `note-bar-${bar}-bit-${bit}-${chord}`;

    return newId;
}

function downIndex(noteId) {
    if (noteId == null) return "";
    let items = getBarBitCord(noteId)
    let bar = parseInt(items[0])
    let bit = parseInt(items[1])
    let chord = parseInt(items[2])

    if (chord > 1) chord--;
    else if (bar > 1) {
        bar--;
        chord = 3;
    }

    let newId = `note-bar-${bar}-bit-${bit}-${chord}`;

    return newId;
}

function upIndex(noteId) {
    if (noteId == null) return "";
    let items = getBarBitCord(noteId)
    let bar = parseInt(items[0])
    let bit = parseInt(items[1])
    let chord = parseInt(items[2])

    if (chord < 3) chord++;
    else if (bar < currentBur - 1) {
        bar++;
        chord = 1;
    }

    let newId = `note-bar-${bar}-bit-${bit}-${chord}`;

    return newId;
}

function colorizeSelectedBarBit(bar, bit) {

    //-- play indicator
    $('.handpan-note-sheet').removeClass('current-bar-border').removeClass('border').addClass('border')
    $(`#note-view-bar-${bar}`).removeClass('border').addClass('current-bar-border');
    $(`#note-bar-${bar}`).removeClass('border').addClass('current-bar-border');

    //-- highligte bar
    $('.handpan-note-sheet-bar').removeClass('current-bit-body')
    $(`#note-bar-${bar}-bit-${bit}-1`).parent().parent().addClass('current-bit-body');
    $(`#note-view-bar-${bar}-bit-${bit}-1`).parent().parent().addClass('current-bit-body');
}

function playNoteSequenceJson(tempo) {

    const notes = selectedSheetNotes;

    changePlayButton(true);

    const baseDelay = (60 / tempo) * 1000; // Base delay for a crotchet (quarter note)

    function playNextNote() {

        //-- check pause
        if (pauseInterrupt) {
            pauseInterrupt = false;
            return;
        }

        if (isLoopActive) {

            let bar = Number(notes[currentPlayIndex].bar) - 1
            let bit = Number(notes[currentPlayIndex].bit) - 1
            let currentDivIndex = (bar * 16) + bit;

            // console.log(`loopStartIndex:${loopStartIndex}, loopEndIndex:${loopEndIndex} --> currentDivIndex:${currentDivIndex}`)
            // console.log(`bar:${bar}, bit:${bit}`)

            //-- manage loop play
            while (currentDivIndex < loopStartIndex) {
                currentPlayIndex++;
                bar = Number(notes[currentPlayIndex].bar) - 1
                bit = Number(notes[currentPlayIndex].bit) - 1
                currentDivIndex = (bar * 16) + bit;
            }

            while (currentDivIndex > loopEndIndex && currentPlayIndex < notes.length) {
                currentPlayIndex = notes.length;
            }
        }

        if (currentPlayIndex < notes.length) {

            // const note = notes[index].trim().toUpperCase();
            // const chord = notes[index].split(' ').map(note => note.trim().toUpperCase());
            const chord = notes[currentPlayIndex].cord;

            const duration = notes[currentPlayIndex].weight;
            const delay = baseDelay * duration; // Adjust delay based on duration

            //-- play indicator
            colorizeSelectedBarBit(notes[currentPlayIndex].bar, notes[currentPlayIndex].bit);

            chord.forEach(item => {
                let noteMapping = item.note;
                if (noteMapping === "N") return;
                // console.log("noteMapping:"+noteMapping)
                const url = noteList[`${noteMapping}`]
                // console.log(url)
                const audio = new Audio(`${url}`);
                audio.play();
            });

            currentPlayIndex++;
            setTimeout(playNextNote, delay); // Set timeout for the next note
            // audio.onended = playNextNote; // Play the next note after the current one ends
        } else {

            //-- check repeat
            if(isRepeatOne === false){

                currentPlayIndex = 0;
                setTimeout(playNextNote, 0);
            }
            else {

                changePlayButton(false);
                currentPlayIndex = 0;

                //-- reset borders
                $('.handpan-note-sheet').removeClass('current-bar-border').removeClass('border').addClass('border')
                $('.handpan-note-sheet-bar').removeClass('current-bit-body')
            }
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

function selectPlayIndicatorPlace(bar, bit) {

    //-- in edit mode div applied after view mode, so sub 15
    // if(isViewMode === false) bar = bar - 14;

    // console.log(selectedSheetNotes.length)
    for (let i = 0; i < selectedSheetNotes.length; i++) {
        // console.log(`i:${i}, bar:${selectedSheetNotes[i]['bar']}, bit:${selectedSheetNotes[i]['bit']}`)
        if (selectedSheetNotes[i]['bar'] === bar.toString() && selectedSheetNotes[i]['bit'] === bit.toString()) {
            currentPlayIndex = i;
            // if(isLoopActive) colorizeLoopIndicator(bar, bit);
            colorizeSelectedBarBit(bar, bit);
            break;
        }
    }
}

//-- select note via hang-drum
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

//-- select note via hang-drum
document.querySelectorAll('.drum-note , .drum-dome, .drum-knock').forEach(section => {
    section.addEventListener('click', function (event) {
        const sectionNumber = this.getAttribute('data-section');
        // Handle the section click as needed
        $(`#${currentNoteId}`).text(sectionNumber);
        // $('.note').parent().removeClass('note-selected')
        // currentNoteId = null;
    });
});


function selectNoteViaHangdrum(note){
    $(`#${currentNoteId}`).text(note);
    $('.note').parent().removeClass('note-selected')
    currentNoteId = null;
}

// console.log(getBarBitCord('note-bar-1-bit-8-1'))

initSheet();

//-- empty sheet
function initSheet() {
    $("#note-sheet").empty();
    $("#note-sheet-view").empty();
    //console.log("empty sheet")
    addBar();
}

//-- add bar
function addBar() {

    const barId = currentBur++;

    //console.log(`barId=${barId}`)

    $("#note-sheet").append(`<div id="note-bar-${barId}" class="row border rounded mt-1 handpan-note-sheet"></div>`);
    $("#note-sheet-view").append(`<div id="note-view-bar-${barId}" class="row border rounded mt-1 handpan-note-sheet"></div>`);

    for (let i = 1; i <= 16; i++) {
        // console.log(i)
        let isBorder = "";
        if (i % 4 === 0) isBorder = "border-end";

        $(`#note-bar-${barId}`).append(`
            <div class="col ${isBorder} p-0 m-0  handpan-note-sheet-bar note-div">
                <div class="d-flex justify-content-center"><a id="note-bar-${barId}-bit-${i}-1" href="#" onclick="selectNote('note-bar-${barId}-bit-${i}-1')" class="note">-</a></div>
                <div class="d-flex justify-content-center"><a id="note-bar-${barId}-bit-${i}-2" href="#" onclick="selectNote('note-bar-${barId}-bit-${i}-2')" class="note">-</a></div>
                <div class="d-flex justify-content-center"><a id="note-bar-${barId}-bit-${i}-3" href="#" onclick="selectNote('note-bar-${barId}-bit-${i}-3')" class="note">-</a></div>
            </div>
        `);

        $(`#note-view-bar-${barId}`).append(`
            <div class="col ${isBorder} p-0 m-0 handpan-note-sheet-bar note-view-div">
                <div class="d-flex justify-content-center"><a id="note-view-bar-${barId}-bit-${i}-1" href="#" class="note" onclick="selectPlayIndicatorPlace(${barId}, ${i})"></a></div>
                <div class="d-flex justify-content-center"><a id="note-view-bar-${barId}-bit-${i}-2" href="#" class="note" onclick="selectPlayIndicatorPlace(${barId}, ${i})"></a></div>
                <div class="d-flex justify-content-center"><a id="note-view-bar-${barId}-bit-${i}-3" href="#" class="note" onclick="selectPlayIndicatorPlace(${barId}, ${i})"></a></div>
            </div>
        `);
    }
}

//-- convert sheet to json
function sheet2json() {

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
            if (itms[0] === '1') return {
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

                //-- re-calculate previous note weight based om current note
                if (currentBarIndex > 0) {
                    const prevNote = notes[currentBarIndex - 1];
                    let diffBit = 0;
                    //-- for same bar
                    if (prevNote.bar === chord1.bar) diffBit = parseInt(chord1.bit) - parseInt(prevNote.bit);
                    //-- for diff bar
                    else {
                        let prevDiffToEndBit = 16 - parseInt(prevNote.bit);
                        let diffBar = (parseInt(chord1.bar) - parseInt(prevNote.bar) - 1) * 16;
                        diffBit = parseInt(chord1.bit) + prevDiffToEndBit + diffBar;
                    }

                    notes[currentBarIndex - 1].weight = 0.25 * diffBit;
                }

            }

        }
    }

    return notes;
}

//-- play sheet
function play() {
    // console.log("start play")
    // console.log(currentBur)

    if (isLoopActive) {

    }

    playNoteSequenceJson(120);
}

//-- pause sheet
function pause() {
    // console.log("start pause")
    // console.log(currentBur)
    pauseInterrupt = true;
    changePlayButton(false);
}

//-- parse bar, bit and code from id
function getBarBitCord(itemId) {

    let items = itemId.split('-');
    let bar = items[2]
    let bit = items[4]
    let cord = items[5]

    return [bar, bit, cord]
}

//-- change play button shape
function changePlayButton(is_play) {
    isPlaying = is_play
    // console.log(is_play)
    if (is_play !== true) {
        $("#btnPause").addClass('d-none')
        $("#btnPlay").removeClass('d-none')
    } else {
        $("#btnPause").removeClass('d-none')
        $("#btnPlay").addClass('d-none')
    }
}

function riseSaveSheetModal() {

    modalSaveSheet.show()
}


function saveSheet() {

    const sheetTitle = $("#inputSheetName").val()
    // console.log(`sheetTitle=${sheetTitle}`)

    modalSaveSheet.hide();

    const sheet = sheet2json();
    // console.log(`sheet:${sheet}`)
    // console.log(sheet)
    // return
    const data = {
        "title": sheetTitle,
        "author_id": 1,
        "last_modified_date": formatDate(Date.now()),
        "sheet": JSON.stringify(sheet)
    };
    // console.log(`data:${data}`);


    postWithToken("api/v1/sheet-list/", data, (data) => {
        // console.log(data)
        riseToast();
    });
}

function changeSheetViewMode() {

    if (isViewMode) {
        isViewMode = false;
        $('#note-sheet-view').addClass('d-none');
        $('#note-sheet').removeClass('d-none');
        $('#btnAddBar').removeClass('d-none');
    } else {
        isViewMode = true;
        $('#note-sheet').addClass('d-none');
        $('#note-sheet-view').removeClass('d-none');
        $('#btnAddBar').addClass('d-none');
    }
}

function changeLoopMode() {

    if (isLoopActive === true) {
        isLoopActive = false;
        // console.log(isLoopActive)
        $("#hfhfhfhg").removeClass('handpan-nav-active')
        $("#loopIconSecondary").removeClass('handpan-nav-active')

        if(startCell !== null) {
            startCell.classList.remove('loop-active');
            endCell.classList.remove('loop-active');
        }
    } else {
        isLoopActive = true;
        // console.log(isLoopActive)
        $("#hfhfhfhg").addClass('handpan-nav-active')
        $("#loopIconSecondary").addClass('handpan-nav-active')

        if(startCell !== null) {
            startCell.classList.add('loop-active');
            endCell.classList.add('loop-active');
        }
    }
}

function changeRepeatMode() {

    let url = $('#img-repeate').attr('src');

    if (isRepeatOne === true) {
        isRepeatOne = false;
        url = url.replace('repeat-one', 'repeat')
        $("#img-repeate").attr("src", url);
    } else {
        isRepeatOne = true;
        url = url.replace('repeat', 'repeat-one')
        $("#img-repeate").attr("src", url);
    }
}

