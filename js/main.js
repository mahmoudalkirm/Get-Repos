let repos_con = document.getElementById('repos');
let getting_repos_status = false;
let main_color = 'rgb(113, 181, 201)'
function get_repos(user_name) {
    let api = `https://api.github.com/users/${user_name}/repos`;
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', api, true);
        xhr.send();

        xhr.onload = () => {
            getting_repos_status = true;
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText))
            } else {
                reject(-1)
            }
        }
    })
}
function render_pre_repos() {
    let c = 0;
    repos_con.innerHTML = ''
    window.innerWidth >= 1200 ? c = 4 : c = 3;
    window.innerWidth < 991 ? c = 2 : null;
    window.innerWidth < 600 ? c = 1 : null;
    for (let i = 0; i < c; i++) {
        let pre_repo = document.createElement('div');
        pre_repo.classList += 'repo';
        repos_con.appendChild(pre_repo)
    }
}
function choose_color(str) {
    if (str != undefined) {
        let colors = {
            "JAVASCRIPT": "#F7DF1E",  // Yellow
            "PYTHON": "#3776AB",      // Blue
            "JAVA": "#007396",        // Teal Blue
            "C": "#A8B9CC",           // Light Blue
            "CPP": "#00599C",         // Dark Blue
            "C#": "#239120",          // Green
            "C++": "#00599C",
            "PHP": "#777BB4",         // Purple
            "RUBY": "#CC342D",        // Red
            "GO": "#00ADD8",          // Cyan
            "RUST": "#DEA584",        // Orange Brown
            "KOTLIN": "#0095D5",      // Bright Blue
            "SWIFT": "#F05138",       // Orange
            "TYPESCRIPT": "#3178C6",  // Blue
            "HTML": "#E34F26",        // Orange-Red
            "CSS": "#1572B6",         // Blue
            "SQL": "#336791",         // Dark Blue
            "PERL": "#39457E",        // Dark Purple
            "R": "#276DC3",           // Blue
            "SCALA": "#DC322F",       // Red
            "DART": "#0175C2",        // Blue
            "HASKELL": "#5E5086",     // Purple
            "MATLAB": "#E16737",      // Orange
            "SHELL": "#89E051",       // Light Green
            "LUA": "#000080",         // Navy Blue
            "OBJECTIVE-C": "#438EFF", // Light Blue
            "VBA": "#867DB1",         // Purple
            "COBOL": "#0247FE",       // Blue
            "FORTRAN": "#4D41B1",     // Purple
            "PASCAL": "#E3F171",      // Yellow
            "D": "#BA372A",           // Red
            "ELIXIR": "#4E2A8E",      // Purple
            "ERLANG": "#B83998",      // Pink
            "F#": "#B845FC",          // Purple
            "VB.NET": "#68217A",      // Purple
            "GROOVY": "#4298B8",      // Blue
            "OCAML": "#EC6813",       // Orange
            "COFFEE": "#244776",      // Blue
            "JULIA": "#9558B2"        // Purple
        }
        for (const i of Object.keys(colors)) {
            if (str.toUpperCase() == i) return colors[i];
        }
    }
    return '#000000'
}
function render_repos(arr, repos_con) {
    arr.forEach(element => {

        let repo = document.createElement('div');
        repo.classList = 'repo';
        let name = document.createElement('p');
        name.innerText = element.name;

        repo.appendChild(name);
        getProjecLanguages(element.languages_url).then((lan) => {
            let it = Object.keys(lan);
            let it_v = Object.values(lan);
            let total = 0;
            for (const iterater of it_v) total += iterater;
            let lan_con = document.createElement('div');
            for (let i = 0; i < 3 && i < it.length; i++) {
                let p = document.createElement('div');
                p.innerText = it[i];
                // p.setAttribute('rate' , `${Math.round((it_v[i]/total)*100)}%`);
                let fill = document.createElement('span');
                fill.style.cssText = `
                 position: absolute;
                 top: calc(50% - 2px);
                 left: 130px;
                 width: ${Math.round((it_v[i] / total) * 100)}%;
                 background-color: ${choose_color(it[i])};
                 height: 8px;
                 z-index:50;
                 border-radius: 0 4px 4px 0 ;
                 transition:  1s;

                 `;
                p.appendChild(fill);
                lan_con.appendChild(p);
            }
            repo.appendChild(lan_con);
        }).catch(() => {

        })
        repos_con.appendChild(repo);
        // styling
        repo.style.cssText = `
        background:${main_color};
        animation: none;
        `
        // linking
        repo.onclick = () => {
            window.open(element.clone_url)
        }
    });


}
function getProjecLanguages(link) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', link);
        xhr.send();
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(-1)
            }
        }
    })
}
function check_user(user_name) {
    let status = false;
    return fetch(`https://api.github.com/search/users?q=${user_name}`).then((res) => {
        let users = res.json();

        return users;
    }).then((users) => {
        return users.items.length > 0 ? true : false;
    })
}
render_pre_repos();
window.onresize = () => {
    if (!getting_repos_status)
        render_pre_repos();
}
let search_con = document.getElementById('search_con')
let user_name = document.getElementById('user_name')
let search_btn = document.getElementById('search');

let error = document.createElement('span');
search_con.appendChild(error)

search_btn.onclick = (e) => {
    e.preventDefault();
    repos_con.innerHTML = ``;
    render_pre_repos();
    user_name.style.border = 'none'
    error.innerText = ``;
    if (window.navigator.onLine && user_name.value.length > 0) {
        check_user(user_name.value).then((res) => {
            if (res) {
                get_repos(user_name.value.trim()).then((resp) => {
                    repos_con.innerHTML = '';
                    render_repos(resp, repos_con);
                })
            } else {
                user_name.style.border = '2px solid red';
                error.innerText = 'undifned user name in github';
                error.style.color = 'red';
                repos_con.innerHTML = ``;
                render_pre_repos();
            }
        })
    }
    return false;
}
