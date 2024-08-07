let isSelecting = false;
let startCell = null;
let endCell = null;

function manageLoopHandler() {
    //-- edit mode
    document.querySelectorAll('.note-div').forEach(cell => {

        cell.addEventListener('mousedown', () => {
            // console.log('mousedown')
            isSelecting = true;
            startCell = cell;
            clearSelection();
            cell.classList.add('loop-selected');
        });

        cell.addEventListener('mouseover', () => {
            // console.log('mouseover')
            if (isSelecting) {
                clearSelection();
                endCell = cell;
                selectRange(startCell, endCell);
            } else {
                cell.classList.add('hovered');
            }
        });

        cell.addEventListener('mouseout', () => {
            // console.log('mouseout')
            cell.classList.remove('hovered');
        });

        cell.addEventListener('mouseup', () => {
            isSelecting = false;
            endCell = cell;
            // selectRange(startCell, endCell);
            clearSelection();
            selectRangeDone(startCell, endCell);
        });
    });

    //-- view mode
    document.querySelectorAll('.note-view-div').forEach(cell => {

        cell.addEventListener('mousedown', () => {
            // console.log('mousedown')
            isSelecting = true;
            startCell = cell;
            clearSelection();
            cell.classList.add('loop-selected');
        });

        cell.addEventListener('mouseover', () => {
            // console.log('mouseover')
            if (isSelecting) {
                clearSelection();
                endCell = cell;
                selectViewRange(startCell, endCell);
            } else {
                cell.classList.add('hovered');
            }
        });

        cell.addEventListener('mouseout', () => {
            // console.log('mouseout')
            cell.classList.remove('hovered');
        });

        cell.addEventListener('mouseup', () => {
            isSelecting = false;
            endCell = cell;
            // selectRange(startCell, endCell);
            clearSelection();
            selectViewRangeDone(startCell, endCell);
        });
    });

}

document.addEventListener('mouseup', () => {
    isSelecting = false;
});

function clearSelection() {

    document.querySelectorAll('.note-div').forEach(cell => {
        cell.classList.remove('loop-selected');
        cell.classList.remove('loop-start-indicator','loop-end-indicator');
    });

    document.querySelectorAll('.note-view-div').forEach(cell => {
        cell.classList.remove('loop-selected');
        cell.classList.remove('loop-start-indicator','loop-end-indicator');
    });

    //-- de-select all selected text
     if (window.getSelection) {window.getSelection().removeAllRanges();}
     else if (document.selection) {document.selection.empty();}

}

function selectRange(start, end) {
    const cells = Array.from(document.querySelectorAll('.note-div'));
    const startIndex = cells.indexOf(start);
    const endIndex = cells.indexOf(end);
    const [minIndex, maxIndex] = [startIndex, endIndex].sort((a, b) => a - b);

    for (let i = minIndex; i <= maxIndex; i++) {
        cells[i].classList.add('loop-selected');
    }
}

function selectViewRange(start, end) {
    const cells = Array.from(document.querySelectorAll('.note-view-div'));
    const startIndex = cells.indexOf(start);
    const endIndex = cells.indexOf(end);
    const [minIndex, maxIndex] = [startIndex, endIndex].sort((a, b) => a - b);

    for (let i = minIndex; i <= maxIndex; i++) {
        cells[i].classList.add('loop-selected');
    }
}

function selectRangeDone(start, end) {
    const cells = Array.from(document.querySelectorAll('.note-div'));
    let startIndex = cells.indexOf(start);
    let endIndex = cells.indexOf(end);

    //-- re-order index if need
    if(endIndex < startIndex){
        let temp = startIndex;
        startIndex = endIndex;
        endIndex = temp;
    }
    //-- ignore when only one cell selected
    if(startIndex === endIndex) {

        //-- select note operation
        let bit = (startIndex % 16) + 1
        let bar = Math.floor(startIndex / 16) + 1
        selectPlayIndicatorPlace(bar, bit)

        //-- draw previous selection
        if(loopStartIndex === null || loopEndIndex === null) return;
        cells[loopStartIndex].classList.add('loop-start-indicator');
        cells[loopEndIndex].classList.add('loop-end-indicator');
    }
    else {
        loopStartIndex = startIndex
        loopEndIndex = endIndex
        cells[startIndex].classList.add('loop-start-indicator');
        cells[endIndex].classList.add('loop-end-indicator');
    }
}

function selectViewRangeDone(start, end) {
    const cells = Array.from(document.querySelectorAll('.note-view-div'));
    let startIndex = cells.indexOf(start);
    let endIndex = cells.indexOf(end);

    //-- re-order index if need
    if(endIndex < startIndex){
        let temp = startIndex;
        startIndex = endIndex;
        endIndex = temp;
    }
    //-- ignore when only one cell selected
    if(startIndex === endIndex) {

        //-- select note operation
        let bit = (startIndex % 16) + 1
        let bar = Math.floor(startIndex / 16) + 1
        selectPlayIndicatorPlace(bar, bit)

        //-- draw previous selection
        if(loopStartIndex === null || loopEndIndex === null) return;
        cells[loopStartIndex].classList.add('loop-start-indicator');
        cells[loopEndIndex].classList.add('loop-end-indicator');
    }
    else {
        loopStartIndex = startIndex
        loopEndIndex = endIndex
        cells[startIndex].classList.add('loop-start-indicator');
        cells[endIndex].classList.add('loop-end-indicator');
    }
}

