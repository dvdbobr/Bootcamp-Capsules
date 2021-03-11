const endpoint = 'https://appleseed-wa.herokuapp.com/api/users/'

class person {
    constructor(id, firstName, lastName, capsule, age, city, gender, hobby) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.capsule = capsule;
        this.age = age;
        this.city = city;
        this.gender = gender;
        this.hobby = hobby;
    }
}
let completeData = [];

let peopleInfo = {
    id: '',
    firstName: '',
    lastName: '',
    capsule: 0,
    age: 0,
    city: '',
    gender: '',
    hobby: ''
}
async function getAllPeople() {
    let callApi = await fetch(endpoint);
    let data = await callApi.json();
    console.log(data)
    return data;
}
//getAllPeople()
async function getPersonInfo(id) {
    let callApi = await fetch(endpoint + id);
    let data = await callApi.json();
    //console.log(data)
    return data;
}
//getPersonInfo(16)
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
    console.log(completeData)
    return completeData;
}
//getPeopleInfoAndName()
const peopleTable = document.querySelector('.peopleTable')
async function createTable() {
    let dataArr = JSON.parse(localStorage.getItem("peopleInfo"))
    console.log(dataArr)
    let html = '';

    for (let i = 0; i < dataArr.length; i++) {
        html +=
            `
        <tr rowIndex="${i}">
        <td>${dataArr[i].id}</td>
        <td class="tableData">${dataArr[i].firstName}
        <input class="editInput" dateType="" type="text">
        </td>
        <td class="tableData">${dataArr[i].lastName}
        <input class="editInput" dateType="" type="text">
        </td>
        <td class="tableData">${dataArr[i].capsule}
        <input class="editInput" dateType="" type="text">
        </td>
        <td class="tableData">${dataArr[i].age}
        <input class="editInput" dateType="" type="text">
        </td>
        <td class="tableData">${dataArr[i].city}
        <input class="editInput" dateType="" type="text">
        </td>
        <td class="tableData">${dataArr[i].gender}
        <input class="editInput" dateType="" type="text">
        </td>
        <td class="tableData">${dataArr[i].hobby}
        <input class="editInput" dateType="" type="text">
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
    peopleTable.innerHTML += html
}
createTable()
function deleteTableRow(id) {
    let dataArr = JSON.parse(localStorage.getItem("peopleInfo"))
    for (let i = 0; i < dataArr.length; i++) {
        if (dataArr[i].id == id) {
            dataArr.splice(i, 1)
        }
    }
    localStorage.setItem('peopleInfo', JSON.stringify(dataArr))
}
const editRow = document.querySelectorAll('.editRow')
const editInputs = document.querySelectorAll('.editInput')
const confirmBtn = document.querySelectorAll('.confirm')
const cancelBtn = document.querySelectorAll('.cancel')
editRow.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let rowIndex = e.currentTarget.parentNode.parentNode.getAttribute('rowIndex')
        confirmBtn[rowIndex].style.display = "block";
        cancelBtn[rowIndex].style.display = "block";
        let currentTrData = e.currentTarget.parentNode.parentNode.childNodes;
        let temp = '';//temp for input storage
        console.log(e.currentTarget.parentNode.parentNode.childNodes)
        console.log("row index: ", rowIndex)
        console.log(editRow[rowIndex])
        for (let i = 0; i < currentTrData.length; i++) {
            //editInputs[i].style.display = "block"
            if (currentTrData[i].className == 'tableData') {
                //console.log(currentTrData[i].childNodes[0]);
                currentTrData[i].childNodes[1].style.display = "block"
            }
        }
        //e.currentTarget.parentNode.parentNode.remove();
        // let idNum = e.currentTarget.getAttribute('personId')
    })
})
confirmBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let currentTrData = e.currentTarget.parentNode.parentNode.childNodes;
        let rowIndex = e.currentTarget.parentNode.parentNode.getAttribute('rowIndex')
        confirmBtn[rowIndex].style.display = "none";
        cancelBtn[rowIndex].style.display = "none";
        for (let i = 0; i < currentTrData.length; i++) {
            //editInputs[i].style.display = "block"
            if (currentTrData[i].className == 'tableData') {
                //console.log(currentTrData[i].childNodes[0]);
                currentTrData[i].childNodes[1].style.display = "none"
            }
        }
    })
})
cancelBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let currentTrData = e.currentTarget.parentNode.parentNode.childNodes;
        let rowIndex = e.currentTarget.parentNode.parentNode.getAttribute('rowIndex')
        confirmBtn[rowIndex].style.display = "none";
        cancelBtn[rowIndex].style.display = "none";
        for (let i = 0; i < currentTrData.length; i++) {
            //editInputs[i].style.display = "block"
            if (currentTrData[i].className == 'tableData') {
                //console.log(currentTrData[i].childNodes[0]);
                currentTrData[i].childNodes[1].style.display = "none"
            }
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