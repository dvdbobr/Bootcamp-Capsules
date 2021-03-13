const endpoint = 'https://appleseed-wa.herokuapp.com/api/users/';
const weatherApi = 'https://api.openweathermap.org/data/2.5/weather?q=';
const weatherKey = ',IL&APPID=1de7192c513e4ffcd37cb83c0b66a291';
const proxy = 'https://api.codetabs.com/v1/proxy/?quest=';

const peopleTable = document.querySelector('.peopleTable')

let completeData = [];
let weatherArr = [];
async function getAllPeople() {
    let callApi = await fetch(endpoint);
    let data = await callApi.json();
    return data;
}

async function getPersonInfo(id) {
    let callApi = await fetch(endpoint + id);
    let data = await callApi.json();
    return data;
}

async function getPeopleInfoAndName() {
    let names = await getAllPeople();

    for (let i = 0; i < names.length; i++) {
        let info = await getPersonInfo(i);
        completeData.push({
            id: names[i].id, firstName: names[i].firstName, lastName: names[i].lastName,
            capsule: names[i].capsule, age: info.age, city: info.city, gender: info.gender, hobby: info.hobby
        });
    }
    localStorage.setItem("peopleInfo", JSON.stringify(completeData))
    return completeData;
}

async function getWeather(city) {
    let callApi = await fetch(proxy + weatherApi + city + weatherKey);
    let data = await callApi.json();
    if (data.main) {
        let celsius = parseInt(data.main.temp) - 273.15;
        return celsius.toFixed(2);
    }
    return "undefined"
}


async function createTable() {
    let dataArr = '';
    if (localStorage.getItem("peopleInfo") == null) {
        dataArr = await getPeopleInfoAndName();
    }
    else {
        dataArr = JSON.parse(localStorage.getItem("peopleInfo"));
    }
    let html = `
    <thead>
        <tr>
            <th>id</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Capsule</th>
            <th>Age</th>
            <th>City</th>
            <th>Gender</th>
            <th>Hobby</th>
            <th colspan="2">Utililities</th>
        </tr>
    </thead>
    <tbody>
    `;

    console.log(dataArr)
    for (let i = 0; i < dataArr.length; i++) {
        if (localStorage.getItem("peopleInfo") == null) {
            weatherData = await getWeather(dataArr[i].city)
            if (weatherData == 'undefined')
                weatherArr.push({ name: dataArr[i].city, temp: 'undefined' });
            else
                weatherArr.push({ name: dataArr[i].city, temp: weatherData });
        }
        else
            weatherArr = JSON.parse(localStorage.getItem("weatherInfo"))

        html +=
            `
        <tr rowIndex="${i}">
        <td>${dataArr[i].id}</td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].firstName}</span>
        <input class="editInput" dataType="firstName" type="text">
        </td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].lastName}</span>
        <input class="editInput" dataType="lastName" type="text">
        </td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].capsule}</span>
        <input class="editInput" dataType="capsule" type="text">
        </td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].age}</span>
        <input class="editInput" dataType="age" type="text">
        </td>
        <td class="tableData weatherContainer">
        <span class="tableText weatherCity">${dataArr[i].city}</span>
        <input class="editInput" dataType="city" type="text">
        <span class="weather">${weatherArr[i].temp}</span>
        </td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].gender}</span>
        <input class="editInput" dataType="gender" type="text">
        </td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].hobby}</span>
        <input class="editInput" dataType="hobby" type="text">
        </td>
        <td class="editAndConfirmBtn">
        <button class="editRow" personId="${dataArr[i].id}">edit</button>
        <button class="confirm" personId="${dataArr[i].id}">confirm</button>
        </td>
        <td class="deleteAndCancelBtn">
        <button class="deleteRow" personId="${dataArr[i].id}">delete</button>
        <button class="cancel" personId="${dataArr[i].id}">cancel</button>
        </td>
        </tr>
        `
    }
    localStorage.setItem('weatherInfo', JSON.stringify(weatherArr))
    html += '</tbody>'
    peopleTable.innerHTML += html
}

function deleteTableRow(id) {
    let dataArr = JSON.parse(localStorage.getItem("peopleInfo"))
    for (let i = 0; i < dataArr.length; i++) {
        if (dataArr[i].id == id) {
            dataArr.splice(i, 1)
        }
    }
    localStorage.setItem('peopleInfo', JSON.stringify(dataArr))
}
function hideAndShowInputFields(currentTrData, rowIndex) {
    const confirmBtn = document.querySelectorAll('.confirm')
    const cancelBtn = document.querySelectorAll('.cancel')
    confirmBtn[rowIndex].style.display = "none";
    cancelBtn[rowIndex].style.display = "none";
    for (let i = 0; i < currentTrData.length; i++) {
        if (currentTrData[i].className == 'tableData' || (currentTrData[i].classList != null && currentTrData[i].classList.contains('weatherContainer'))) {
            currentTrData[i].childNodes[1].style.display = "block"
            currentTrData[i].childNodes[3].style.display = "none"
            if (currentTrData[i].childNodes.length > 5)
                currentTrData[i].childNodes[5].style.display = "block"
        }
    }
}
createTable().then(() => {
    const editRow = document.querySelectorAll('.editRow')
    const editInputs = document.querySelectorAll('.editInput')
    const confirmBtn = document.querySelectorAll('.confirm')
    const cancelBtn = document.querySelectorAll('.cancel')
    const tableText = document.querySelectorAll('.tableText')
    editRow.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let rowIndex = e.currentTarget.parentNode.parentNode.getAttribute('rowIndex')
            let currentTrData = e.currentTarget.parentNode.parentNode.childNodes;
            confirmBtn[rowIndex].style.display = "block";
            cancelBtn[rowIndex].style.display = "block";
            console.log(e.currentTarget.parentNode.parentNode.childNodes)
            console.log("row index: ", rowIndex)
            console.log(editRow[rowIndex])
            for (let i = 0; i < currentTrData.length; i++) {//make input appear and text disappear
                if (currentTrData[i].className == 'tableData' || (currentTrData[i].classList != null && currentTrData[i].classList.contains('weatherContainer'))) {
                    console.log(currentTrData[i].classList);
                    currentTrData[i].childNodes[1].style.display = "none"
                    currentTrData[i].childNodes[3].style.display = "block"
                    if (currentTrData[i].childNodes.length > 5)
                        currentTrData[i].childNodes[5].style.display = "none"
                }
                if (currentTrData[i].classList != null && currentTrData[i].classList.contains('weatherContainer')) {
                    console.log(currentTrData[i].childNodes[5])
                }
            }
            for (let i = rowIndex * 7; i < (rowIndex * 7 + 7); i++) {//checks input fields in row
                editInputs[i].value = tableText[i].textContent
            }

        })
        addSearchListeners()
    })
    confirmBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let dataArr = JSON.parse(localStorage.getItem("peopleInfo"))
            let currentTrData = e.currentTarget.parentNode.parentNode.childNodes;
            let rowIndex = e.currentTarget.parentNode.parentNode.getAttribute('rowIndex')
            hideAndShowInputFields(currentTrData, rowIndex)
            for (let i = rowIndex * 7; i < (rowIndex * 7 + 7); i++) {//checks input fields in row
                if (editInputs[i].value != '') {
                    tableText[i].textContent = editInputs[i].value
                    let dataType = editInputs[i].getAttribute('dataType')
                    dataArr[rowIndex][dataType] = editInputs[i].value
                }

            }
            localStorage.setItem('peopleInfo', JSON.stringify(dataArr))
        })
    })
    cancelBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let currentTrData = e.currentTarget.parentNode.parentNode.childNodes;
            let rowIndex = e.currentTarget.parentNode.parentNode.getAttribute('rowIndex')
            hideAndShowInputFields(currentTrData, rowIndex)
            for (let i = rowIndex * 7; i < (rowIndex * 7 + 7); i++) {//checks input fields in row
                if (editInputs[i].value != '')
                    editInputs[i].value = ''
            }
        })
    })
    const del = document.querySelectorAll('.deleteRow')
    del.forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log(e.currentTarget.parentNode.parentNode)
            e.currentTarget.parentNode.parentNode.remove();
            let idNum = e.currentTarget.getAttribute('personId')
            deleteTableRow(idNum)
        })
    })
    addSearchListeners()
    addSortListener()
})
function addSearchListeners() {
    let selectedType = 'firstName';
    const searchInput = document.querySelector('.searchInput');
    const selectFilter = document.querySelector('.selectFilter');
    selectFilter.addEventListener('change', (e) => {
        selectedType = e.currentTarget.value
        console.log(selectedType)
    })
    searchInput.addEventListener('keyup', (e) => {
        let arr = JSON.parse(localStorage.getItem("peopleInfo"))
        let value = e.currentTarget.value
        let dataArr = searchTable(arr, value, selectedType)
        buildFilteredTable(dataArr)
    })
}
//filter table by type
function searchTable(dataArr, value, type) {
    let filteredArr = [];
    for (let i = 0; i < dataArr.length; i++) {
        if (type == 'age' || type == 'capsule') {
            let searchedData = dataArr[i][type]
            if (String(searchedData).indexOf(value) > -1) {
                filteredArr.push(dataArr[i]);
            }
        }
        else {
            let searchedData = dataArr[i][type].toLowerCase();
            value = value.toLowerCase();
            if (searchedData.includes(value)) {
                filteredArr.push(dataArr[i]);
            }
        }
    }
    return filteredArr;
}
function buildFilteredTable(dataArr) {
    let html = `
    <thead>
        <tr>
        <th>id</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Capsule</th>
        <th>Age</th>
        <th>City</th>
        <th>Gender</th>
        <th>Hobby</th>
        <th colspan="2">Utililities</th>
        </tr>
    </thead>
    <tbody>
    `;
    peopleTable.innerHTML = '';
    for (let i = 0; i < dataArr.length; i++) {
        html +=
            `
        <tr rowIndex="${i}">
        <td>${dataArr[i].id}</td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].firstName}</span>
        <input class="editInput" dataType="firstName" type="text">
        </td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].lastName}</span>
        <input class="editInput" dataType="lastName" type="text">
        </td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].capsule}</span>
        <input class="editInput" dataType="capsule" type="text">
        </td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].age}</span>
        <input class="editInput" dataType="age" type="text">
        </td>
        <td class="tableData weatherContainer">
        <span class="tableText weatherCity">${dataArr[i].city}</span>
        <input class="editInput" dataType="city" type="text">
        <span class="weather">${weatherArr[i].temp}</span>
        </td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].gender}</span>
        <input class="editInput" dataType="gender" type="text">
        </td>
        <td class="tableData">
        <span class="tableText">${dataArr[i].hobby}</span>
        <input class="editInput" dataType="hobby" type="text">
        </td>
        <td class="editAndConfirmBtn">
        <button class="editRow" personId="${dataArr[i].id}">edit</button>
        <button class="confirm" personId="${dataArr[i].id}">confirm</button>
        </td>
        <td class="deleteAndCancelBtn">
        <button class="deleteRow" personId="${dataArr[i].id}">delete</button>
        <button class="cancel" personId="${dataArr[i].id}">cancel</button>
        </td>
        </tr>
        `
    }
    html += '</tbody>'
    peopleTable.innerHTML += html
    addSortListener()
}
function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;//asc == 1 else desc == -1
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll('tr'));

    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim().toLowerCase()
        const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim().toLowerCase()
        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier)
    })
    //remove rows
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild)
    }
    //re-add new rows
    tBody.append(...sortedRows);
    //remember how the column is currently sorted
    table.querySelectorAll('th').forEach(th => th.classList.remove('th-sort=asc', 'th-sort-desc'));
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle('th-sort-asc', asc)
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle('th-sort-desc', !asc)
}
function addSortListener() {
    document.querySelectorAll('.tableSortable th').forEach(th => {
        th.addEventListener('click', () => {
            const tableElement = th.parentElement.parentElement.parentElement;
            const headerIndex = Array.prototype.indexOf.call(th.parentElement.children, th)
            const currentIsAscending = th.classList.contains('th-sort-asc')

            sortTableByColumn(tableElement, headerIndex, !currentIsAscending)
        })
    })
}


