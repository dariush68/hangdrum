
GetSheetList()

function GetSheetList(){

    getWithToken("api/v1/sheet-list/", (data)=>{
        console.log(data)

        $('#div-sheet-list').empty();

        for (let i=0; i<data.count; i++){
            $('#div-sheet-list').append(`
                <div class="card mt-2">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-9">
                                <img src="${music_src}" alt="" height="50px"
                                     class="border rounded p-2">
                                <span class="m-2">${data.results[i].title}</span>
                                <span class="m-2 small"> <img src="${user_src}" alt="user" height="20px"> <span style="color: grey"> dariush abed</span></span>
        
                            </div>
                            <div class="col-3 d-flex justify-content-end">
                                <span class="mt-3 small"> <img src="${date_src}" alt="user" height="20px"> <span style="color: grey"> 2024-06-21</span></span>
                                <a style="margin-left: 15px" href="#" title="Add sheet to List"><img src="${ticket_src}" alt="" height="50px"></a>
                                <a href="#" title="Select sheet"><img src="${video_src}" alt="" height="50px"></a>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
    });
}