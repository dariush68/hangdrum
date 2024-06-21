function login() {

    const username = $('#inputUsername').val()
    const password = $('#inputPassword').val()
    console.log("--login," + username + "," + password)


    let formData = new FormData();
    formData.append('username', $('#inputUsername').val().trim());
    formData.append('password', $('#inputPassword').val().trim());

    $("#p_error").empty()

    $.ajax({
        // url: "/api/v1/token/create/",
        url: _base_url + 'api/token/',
        type: "POST",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            // store tokens in localStorage
            console.log('ffffff')
            console.log(data)
            window.localStorage.setItem('refreshToken', data['refresh']);
            window.localStorage.setItem('accessToken', data['access']);
            // alert(window.localStorage.getItem('accessToken'))
            window.location.href = _base_url;

        },
        error: function (rs, e) {
            console.error(rs.status);
            console.error(rs.responseText);
            $("#p_error").append(JSON.parse(rs.responseText)['detail'])
        }
    });

}
