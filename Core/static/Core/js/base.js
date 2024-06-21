/* Global variables */
const _base_url = "http://127.0.0.1:8000/"
// const _base_url = "https://site.ir/"




function getWithToken(endPoint, cb, language = null) {
    /*
       Hitting an API endpoint, By sending access token in header of an API request
   */
    $.ajax({
        url: _base_url + endPoint,
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem('accessToken')}`,
            'Http-Accept-Language': language == null ? 'fa' : language
        },
        type: "GET",
        tokenFlag: true,
        success: function (data) {
            // console.log(data);
            if (cb) return cb(data)
        },
        error: handleAjaxError
    }); // end ajax
}

function handleAjaxError(rs, e) {
    /*
        And if it returns 401, then we call obtainAccessTokenWithRefreshToken() method
        To get a new access token using refresh token.
    */
    if (rs.status == 401) {
        if (this.tokenFlag) {
            this.tokenFlag = false;
            if (obtainAccessTokenWithRefreshToken()) {
                this.headers["Authorization"] = `Bearer ${window.localStorage.getItem('accessToken')}`
                $.ajax(this);  // calling API endpoint again with new access token
            }
        }
    } else {
        console.error(rs.responseText);
    }
}

function obtainAccessTokenWithRefreshToken() {
    /*
        This method will create new access token by using refresh token.
        If refresh token is invalid it will redirect user to login page
    */
    let flag = true;
    let formData = new FormData();
    formData.append('refresh', window.localStorage.getItem('refreshToken'));
    $.ajax({
        url: _base_url + 'api/token/refresh/',
        type: "POST",
        data: formData,
        async: false,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            window.localStorage.setItem('accessToken', data['access']);
        },
        error: function (rs, e) {
            if (rs.status == 401) {
                flag = false;
                window.localStorage.removeItem('refreshToken');
                window.localStorage.removeItem('accessToken');
                window.location.href = "/login/";
            } else {
                console.error(rs.responseText);
            }
        }
    }); // end ajax
    return flag
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

// logout()
function logout() {

    window.localStorage.removeItem('refreshToken');
    window.localStorage.removeItem('accessToken');
    window.location.href = "/login/";
}

function GroupByData(data, field) {
    return data.reduce((acc, item) => {
        if (!acc[item[field]]) {
            acc[item[field]] = [];
        }
        acc[item[field]].push(item);
        return acc;
    }, {});
}

function downloadCSVfile(csvData, filename = "data.csv") {

    let _csv = csvData.join('\n');
    const csvFile = new Blob([_csv], {type: 'text/csv'});
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
}



function riseToast() {
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl, option)
    })
}