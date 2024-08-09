// Create a timeline for the animations
const tl = gsap.timeline({paused: true});

//-- animate note on hang-drum
function playHangdrumNote(note, isLeft = false) {
    switch (note) {
        case "1":
            animateNote($("#note1"))
            break;
        case "2":
            animateNote($("#note2"))
            break;
        case "3":
            animateNote($("#note3"))
            break;
        case "4":
            animateNote($("#note4"))
            break;
        case "5":
            animateNote($("#note5"))
            break;
        case "6":
            animateNote($("#note6"))
            break;
        case "7":
            animateNote($("#note7"))
            break;
        case "8":
            animateNote($("#note8"))
            break;
        case "D":
            animateNote($("#ding"))
            break;
        case "T":
            animateNote($("#side"))
            break;
        case "K":
            if (isLeft === true) animateNote($("#knockLeft"))
            else animateNote($("#knockRight"));
            break;
        case "S":
            if (isLeft === true) animateNote($("#slapLeft"));
            else animateNote($("#slapRight"));
            break;
    }
}


function animateNote(note) {
    gsap.to(note, {
        scale: 1.04,
        fill: "#ff6347", // Change to desired color
        duration: 0.2,
        repeat: 1,
        yoyo: true,
        ease: 'power1.inOut',
        onStart: () => playSound(note.id),
        onComplete: () => gsap.to(note, {fill: "#5677fc90", duration: 1.2}) // Reset color
    });
}


// Add click event to play the animation and sound
const notes = document.querySelectorAll('.drum-note');
notes.forEach(note => {
    note.addEventListener('click', () => {

        console.log(note)

        // Create and play animation for the clicked note
        gsap.to(note, {
            scale: 1.04,
            fill: "#ff6347", // Change to desired color
            duration: 0.2,
            repeat: 1,
            yoyo: true,
            ease: 'power1.inOut',
            onStart: () => playSound(note.id),
            onComplete: () => gsap.to(note, {fill: "#5677fc90", duration: 1.2}) // Reset color
        });
    });
});

// Function to play sound
function playSound(noteId) {
//   const audio = new Audio(`sounds/${noteId}.mp3`);
//   audio.play();
}

// Add click event to play the animation and sound
notes.forEach(note => {
    note.addEventListener('click', () => {
        tl.play(0);
    });
});

//========================
// Add click event to play the animation and sound
const notesDingSide = document.querySelectorAll('.drum-dome');
notesDingSide.forEach(note => {
    note.addEventListener('click', () => {
        // Create and play animation for the clicked note
        gsap.to(note, {
            scale: 1.01,
            fill: "#ff6347", // Change to desired color
            duration: 0.2,
            repeat: 1,
            yoyo: true,
            ease: 'power1.inOut',
            onStart: () => playSound(note.id),
            onComplete: () => gsap.to(note, {fill: "#03a9f480", duration: 1.2}) // Reset color
        });
    });
});

// Add click event to play the animation and sound
notesDingSide.forEach(note => {
    note.addEventListener('click', () => {
        tl.play(0);
    });
});


//==============================
// Add click event to play the animation and sound for knock areas
const knocks = document.querySelectorAll('.drum-knock');
knocks.forEach(knock => {
    knock.addEventListener('click', () => {
        gsap.to(knock, {
            scale: 1.01,
            fill: "#ff6347", // Change to desired color
            duration: 0.3,
            repeat: 1,
            yoyo: true,
            ease: 'power1.out',
            onStart: () => playSound(knock.id),
            onComplete: () => gsap.to(knock, {fill: "#5677fc20", duration: 0.1}) // Reset color
        });
    });
});
// Add click event to play the animation and sound
knocks.forEach(note => {
    note.addEventListener('click', () => {
        tl.play(0);
    });
});