var SheetList = null;
var selectedTab = "Global";
var debounceTimer;

GetSheetList()

//-- sheet search

$('#inputSheetSearch').on('input', function () {
    const inputValue = $(this).val();

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(function () {
        console.log('Input value:', inputValue);
        GetSheetList()
    }, 400);
});


function GetSheetList() {

    let url = "api/v1/sheet-list/?";
    const inputValue = $('#inputSheetSearch').val();
    if (inputValue != "") url = url + "q=" + inputValue;

    if (selectedTab == "MySheet") url = url + "&userSheet=true";

    getWithToken(url, (data) => {
        // console.log(data)
        SheetList = data.results;

        $('#div-sheet-list').empty();

        for (let i = 0; i < data.count; i++) {
            console.log(data.results[i].author)
            $('#div-sheet-list').append(`
                <div class="card mt-2">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-7 col-sm-12">
                                <img src="${music_src}" alt="" height="50px"
                                     class="border rounded p-2">
                                <span class="m-2">${data.results[i].title}</span>
                                
        
                            </div>
                            <div class="col-md-5 col-sm-12 d-flex justify-content-end">
                                <span class="mt-3 small"> <img src="${user_src}" alt="user" height="20px" style="opacity: 0.4"> <span style="color: grey"> ${data.results[i].author_name} </span></span>
                                <span class="mt-3 small" style="margin-left: 30px"> <img src="${date_src}" alt="user" height="20px" style="opacity: 0.4"> <span style="color: grey"> ${showDate(data.results[i].last_modified_date)}</span></span>
                                <span class="mt-3 small" style="margin-left: 30px"> <img src="${eye_src}" alt="user" height="20px" style="opacity: 0.2"> <span style="color: grey" class="small"> ${data.results[i].view_count}</span></span>
                                <a style="margin-left: 15px" href="#" title="Add sheet to List"><img src="${ticket_src}" alt="" height="50px"></a>
                                <a href="#" onclick="SelectSheet('${i}')" title="Select sheet"><img src="${video_src}" alt="" height="50px"></a>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
    });
}

function GetSheetItem(sheetId) {

    let url = "api/v1/sheet-list/" + sheetId + "/";

    getWithToken(url, (data) => {
        // console.log(data)
        SheetList = data.results;

        $('#div-sheet-list').empty();

        for (let i = 0; i < data.count; i++) {
            console.log(data.results[i].author)
            $('#div-sheet-list').append(`
                <div class="card mt-2">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-7 col-sm-12">
                                <img src="${music_src}" alt="" height="50px"
                                     class="border rounded p-2">
                                <span class="m-2">${data.results[i].title}</span>
                                
        
                            </div>
                            <div class="col-md-5 col-sm-12 d-flex justify-content-end">
                                <span class="mt-3 small"> <img src="${user_src}" alt="user" height="20px" style="opacity: 0.4"> <span style="color: grey"> ${data.results[i].author_name} </span></span>
                                <span class="mt-3 small" style="margin-left: 30px"> <img src="${date_src}" alt="user" height="20px" style="opacity: 0.4"> <span style="color: grey"> ${showDate(data.results[i].last_modified_date)}</span></span>
                                <span class="mt-3 small" style="margin-left: 30px"> <img src="${eye_src}" alt="user" height="20px" style="opacity: 0.2"> <span style="color: grey" class="small"> ${data.results[i].view_count}</span></span>
                                <a style="margin-left: 15px" href="#" title="Add sheet to List"><img src="${ticket_src}" alt="" height="50px"></a>
                                <a href="#" onclick="SelectSheet('${i}')" title="Select sheet"><img src="${video_src}" alt="" height="50px"></a>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
    });
}

function SelectSheet(sheetId) {
    console.log(SheetList[sheetId].title)
    selectedSheet = SheetList[sheetId]

}

function ChangeTab(tabTitle) {
    if(selectedTab == tabTitle) return;

    switch (tabTitle) {
        case "Global":
            selectedTab = "Global"
            break;
        case "MySheet":
            selectedTab = "MySheet"
            break;
    }
    GetSheetList();
}