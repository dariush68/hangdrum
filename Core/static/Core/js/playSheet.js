// Constants
const NOTE_TYPES = {
    '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
    '6': '6', '7': '7', '8': '8', 'D': 'D', '-': '-'
};
const BASE_DELAY_FACTOR = 60 * 1000; // 60 seconds in milliseconds
const DEFAULT_TEMPO = 120;

// State
const state = {
    currentNoteId: null,
    currentBar: 1,
    isPlaying: false,
    isViewMode: true,
    currentPlayIndex: 0,
    pauseInterrupt: false,
    selectedSheetNotes: null,
    isLoopActive: false,
    isRepeatOne: true,
    isRightHand: true,
    loopStartIndex: null,
    loopEndIndex: null
};

// DOM Elements
const elements = {
    btnAddBar: document.getElementById('btnAddBar'),
    btnPlay: document.getElementById('btnPlay'),
    btnPause: document.getElementById('btnPause'),
    noteSheet: document.getElementById('note-sheet'),
    noteSheetView: document.getElementById('note-sheet-view'),
    sheetInfo: document.getElementById('sheet-info'),
    handIndicator: document.getElementById('hang-drum-hands'),
    inputSheetName: document.getElementById('inputSheetName')
};

// Initialize modals
const modals = {
    mainModal: new bootstrap.Modal(document.getElementById('myModal')),
    saveModal: new bootstrap.Modal(document.getElementById('modalSaveSheet'))
};

// Initialize event listeners
function initEventListeners() {
    elements.btnAddBar.addEventListener('click', addBar);
    elements.btnPlay.addEventListener('click', play);
    elements.btnPause.addEventListener('click', pause);

    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', handleKeyDown);

    // Add other event listeners...
}

// Key handlers
function handleKeyUp(event) {
    if (event.key === 'Control') {
        setHand(true);
    }
}

function handleKeyDown(event) {
    if (!state.currentNoteId) return;

    if (event.ctrlKey) {
        setHand(false);
        event.preventDefault();
        event.stopPropagation();
    }

    const keyActions = {
        49: () => updateNote('1'), // 1
        50: () => updateNote('2'), // 2
        // Add other number keys...
        68: () => updateNote('D'), // D
        27: () => updateNote('-'), // Esc
        8: () => updateNote('-'),  // Backspace
        46: () => updateNote('-'), // Del
        37: () => selectNote(getAdjacentNote('left')),
        39: () => selectNote(getAdjacentNote('right')),
        38: () => selectNote(getAdjacentNote('up')),
        40: () => selectNote(getAdjacentNote('down'))
    };

    if (keyActions[event.keyCode]) {
        keyActions[event.keyCode]();
    }
}

function checkSelectedSheet() {
    if (!selectedSheet) return;

    // Parse the sheet data
    const sheetJson = JSON.parse(selectedSheet.sheet);
    elements.sheetInfo.textContent = selectedSheet.title;

    // Get the maximum bar count
    const maxBarCount = parseInt(sheetJson[sheetJson.length - 1].bar);

    // Clear and rebuild the sheet
    elements.noteSheet.innerHTML = '';
    elements.noteSheetView.innerHTML = '';
    state.currentBar = 1;

    // Add all needed bars
    for (let i = 1; i <= maxBarCount; i++) {
        addBar();
    }

    // Set notes from the sheet data
    sheetJson.forEach(note => {
        note.cord.forEach((cord, index) => {
            if (!cord) return;

            const cordId = `note-bar-${note.bar}-bit-${note.bit}-${index + 1}`;
            const cordViewId = `note-view-bar-${note.bar}-bit-${note.bit}-${index + 1}`;

            const cordElement = document.getElementById(cordId);
            const cordViewElement = document.getElementById(cordViewId);

            if (cordElement && cordViewElement) {
                cordElement.textContent = cord.note;
                cordViewElement.textContent = cord.note;

                if (cord.hand === "L") {
                    cordElement.classList.add('note-left-hand');
                    cordViewElement.classList.add('note-left-hand');
                }
            }
        });
    });

    // Update the sheet notes and manage loop
    state.selectedSheetNotes = sheetToJson();
    manageLoopHandler();
}

function manageLoopHandler() {
    if (!state.selectedSheetNotes || state.selectedSheetNotes.length === 0) {
        state.loopStartIndex = null;
        state.loopEndIndex = null;
        return;
    }

    // Get first and last notes
    const firstNote = state.selectedSheetNotes[0];
    const lastNote = state.selectedSheetNotes[state.selectedSheetNotes.length - 1];

    // Calculate indices
    state.loopStartIndex = (parseInt(firstNote.bar) - 1) * 16 + (parseInt(firstNote.bit) - 1);
    state.loopEndIndex = (parseInt(lastNote.bar) - 1) * 16 + (parseInt(lastNote.bit) - 1);

    // Update UI if loop is active
    if (state.isLoopActive) {
        colorizeLoopIndicators(firstNote.bar, firstNote.bit, lastNote.bar, lastNote.bit);
    }
}

function playChord(chordNotes) {
    if (!chordNotes || chordNotes.length === 0) return;

    // Play each note in the chord
    chordNotes.forEach(note => {
        if (note.note === "E") return; // Skip if note is empty

        const audio = new Audio(noteList[note.note]);
        if (audio) {
            audio.play().catch(e => console.error("Audio playback failed:", e));
        }

        // Visual feedback
        playHangdrumNote(note.note);
        setHand(note.hand === "R");
    });
}

// Visual feedback function (mock implementation)
function playHangdrumNote(note) {
    // Add any visual effects for playing a note
    const element = document.querySelector(`[data-note="${note}"]`);
    if (element) {
        element.classList.add('active-note');
        setTimeout(() => element.classList.remove('active-note'), 200);
    }
}

function colorizeLoopIndicators(startBar, startBit, endBar, endBit) {
    // Clear previous loop indicators
    document.querySelectorAll('.loop-active').forEach(el => {
        el.classList.remove('loop-active');
    });

    // Add new loop indicators
    const startElement = document.getElementById(`note-bar-${startBar}-bit-${startBit}-1`);
    const endElement = document.getElementById(`note-bar-${endBar}-bit-${endBit}-1`);

    if (startElement && endElement) {
        startElement.parentElement.parentElement.classList.add('loop-active');
        endElement.parentElement.parentElement.classList.add('loop-active');
    }
}

function sheetToJson() {
    const notes = [];
    let barIndex = 0;

    function processCord(bar, bit, cordId) {
        const element = document.getElementById(`note-bar-${bar}-bit-${bit}-${cordId}`);
        if (!element) return null;

        const value = element.textContent;
        const isLeftHand = element.classList.contains('note-left-hand');

        // Handle empty first position
        if (value === '-' && bit === 1 && cordId === 1) {
            return bar === '1' ?
                { note: 'E', bar, bit, cord: cordId, weight: 4, hand: 'R' } :
                null;
        }

        return value !== '-' ?
            { note: value, bar, bit, cord: cordId, weight: 4, hand: isLeftHand ? 'L' : 'R' } :
            null;
    }

    function calculateWeight(prevNote, currentNote) {
        if (!prevNote) return;

        let diffBit;
        if (prevNote.bar === currentNote.bar) {
            diffBit = parseInt(currentNote.bit) - parseInt(prevNote.bit);
        } else {
            const prevDiffToEndBit = 16 - parseInt(prevNote.bit);
            const diffBar = (parseInt(currentNote.bar) - parseInt(prevNote.bar) - 1) * 16;
            diffBit = parseInt(currentNote.bit) + prevDiffToEndBit + diffBar;
        }

        prevNote.weight = 0.25 * diffBit;
    }

    // Iterate through all bars and bits
    for (let bar = 1; bar < state.currentBar; bar++) {
        for (let bit = 1; bit <= 16; bit++) {
            const cords = [1, 2, 3]
                .map(cordId => processCord(bar, bit, cordId))
                .filter(Boolean);

            if (cords.length > 0) {
                const newNote = {
                    bar: cords[0].bar,
                    bit: cords[0].bit,
                    weight: cords[0].weight,
                    cord: cords.map(c => ({
                        note: c.note,
                        hand: c.hand
                    }))
                };

                if (notes.length > 0) {
                    calculateWeight(notes[notes.length - 1], cords[0]);
                }

                notes.push(newNote);
            }
        }
    }

    return notes;
}

// Note manipulation
function updateNote(value) {
    const noteElement = document.getElementById(state.currentNoteId);
    noteElement.textContent = value;

    if (value !== '-') {
        noteElement.classList.toggle('note-left-hand', !state.isRightHand);
    } else {
        noteElement.classList.remove('note-left-hand');
    }
}

function getAdjacentNote(direction) {
    if (!state.currentNoteId) return '';

    const [bar, bit, chord] = getNotePosition(state.currentNoteId);
    let newBar = bar, newBit = bit, newChord = chord;

    switch (direction) {
        case 'left':
            if (bit > 1) newBit--;
            else if (bar > 1) { newBit = 16; newBar--; }
            break;
        case 'right':
            if (bit < 16) newBit++;
            else if (newBar < state.currentBar - 1) { newBit = 1; newBar++; }
            break;
        case 'up':
            if (chord < 3) newChord++;
            else if (newBar < state.currentBar - 1) { newBar++; newChord = 1; }
            break;
        case 'down':
            if (chord > 1) newChord--;
            else if (newBar > 1) { newBar--; newChord = 3; }
            break;
    }

    return `note-bar-${newBar}-bit-${newBit}-${newChord}`;
}

// Sheet management
function initSheet() {
    elements.noteSheet.innerHTML = '';
    elements.noteSheetView.innerHTML = '';
    addBar();
}

function addBar() {
    const barId = state.currentBar++;

    const createBarHTML = (isView) => `
        <div id="note-${isView ? 'view-' : ''}bar-${barId}" class="row border rounded mt-1 handpan-note-sheet">
            ${Array.from({length: 16}, (_, i) => createBitHTML(barId, i + 1, isView)).join('')}
        </div>
    `;

    elements.noteSheet.insertAdjacentHTML('beforeend', createBarHTML(false));
    elements.noteSheetView.insertAdjacentHTML('beforeend', createBarHTML(true));
}

function createBitHTML(barId, bit, isView) {
    const isBorder = bit % 4 === 0 ? 'border-end' : '';
    const prefix = isView ? 'note-view-' : 'note-';
    const clickHandler = isView ?
        `onclick="selectPlayIndicatorPlace(${barId}, ${bit})"` :
        `onclick="selectNote('note-bar-${barId}-bit-${bit}-1')"`;

    return `
        <div class="col ${isBorder} p-0 m-0 handpan-note-sheet-bar ${isView ? 'note-view-div' : 'note-div'}">
            ${[1, 2, 3].map(cord => `
                <div class="d-flex justify-content-center">
                    <a id="${prefix}bar-${barId}-bit-${bit}-${cord}" href="#" class="note" ${cord === 1 ? clickHandler : ''}>-</a>
                </div>
            `).join('')}
        </div>
    `;
}

// Playback control
function play() {
    if (!state.selectedSheetNotes) return;
    playNoteSequence(DEFAULT_TEMPO);
}

function pause() {
    state.pauseInterrupt = true;
    updatePlayButton(false);
}

function playNoteSequence(tempo) {
    const baseDelay = BASE_DELAY_FACTOR / tempo;
    state.isPlaying = true;
    updatePlayButton(true);

    const playNextNote = () => {
        if (state.pauseInterrupt) {
            state.pauseInterrupt = false;
            return;
        }

        if (shouldHandleLoop()) {
            handleLoopPlayback();
        }

        if (state.currentPlayIndex < state.selectedSheetNotes.length) {
            const currentNote = state.selectedSheetNotes[state.currentPlayIndex];
            highlightCurrentNote(currentNote);
            playChord(currentNote.cord);

            state.currentPlayIndex++;
            setTimeout(playNextNote, baseDelay * currentNote.weight);
        } else {
            handlePlaybackEnd();
        }
    };

    playNextNote();
}

function shouldHandleLoop() {
    return state.isLoopActive && state.loopStartIndex !== null && state.loopEndIndex !== null;
}

function handleLoopPlayback() {
    const currentNote = state.selectedSheetNotes[state.currentPlayIndex];
    const bar = Number(currentNote.bar) - 1;
    const bit = Number(currentNote.bit) - 1;
    const currentDivIndex = (bar * 16) + bit;

    while (currentDivIndex < state.loopStartIndex) {
        state.currentPlayIndex++;
        // Update currentDivIndex for the new note
    }

    while (currentDivIndex > state.loopEndIndex && state.currentPlayIndex < state.selectedSheetNotes.length) {
        state.currentPlayIndex = state.selectedSheetNotes.length;
    }
}

function handlePlaybackEnd() {
    if (!state.isRepeatOne) {
        state.currentPlayIndex = 0;
        setTimeout(playNextNote, 0);
    } else {
        resetPlaybackState();
    }
}

function resetPlaybackState() {
    state.isPlaying = false;
    state.currentPlayIndex = 0;
    updatePlayButton(false);
    resetHighlighting();
}

// Helper functions
function getNotePosition(noteId) {
    const parts = noteId.split('-');
    return [parseInt(parts[2]), parseInt(parts[4]), parseInt(parts[5])];
}

function setHand(isRight) {
    state.isRightHand = isRight;
    elements.handIndicator.classList.toggle('hang-drum-right-hand', isRight);
    elements.handIndicator.classList.toggle('hang-drum-left-hand', !isRight);
}

function updatePlayButton(isPlaying) {
    state.isPlaying = isPlaying;
    elements.btnPause.classList.toggle('d-none', !isPlaying);
    elements.btnPlay.classList.toggle('d-none', isPlaying);
}

function highlightCurrentNote(note) {
    // Remove previous highlights
    document.querySelectorAll('.handpan-note-sheet').forEach(el => {
        el.classList.remove('current-bar-border');
        el.classList.add('border');
    });

    // Add new highlights
    const barElement = document.getElementById(`note-view-bar-${note.bar}`);
    if (barElement) {
        barElement.classList.remove('border');
        barElement.classList.add('current-bar-border');
    }

    // Highlight current bit
    document.querySelectorAll('.handpan-note-sheet-bar').forEach(el => {
        el.classList.remove('current-bit-body');
    });

    const bitContainer = document.querySelector(`#note-bar-${note.bar}-bit-${note.bit}-1`).parentElement.parentElement;
    bitContainer.classList.add('current-bit-body');
}

// Initialize the application
function init() {
    initEventListeners();
    initSheet();
}

// Start the application
init();