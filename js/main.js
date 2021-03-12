const endpoint = 'https://appleseed-wa.herokuapp.com/api/users/'

// class person {
//     constructor(id, firstName, lastName, capsule, age, city, gender, hobby) {
//         this.id = id;
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.capsule = capsule;
//         this.age = age;
//         this.city = city;
//         this.gender = gender;
//         this.hobby = hobby;
//     }
// }
let completeData = [];

// let peopleInfo = {
//     id: '',
//     firstName: '',
//     lastName: '',
//     capsule: 0,
//     age: 0,
//     city: '',
//     gender: '',
//     hobby: ''
// }
async function getAllPeople() {
    let callApi = await fetch(endpoint);
    let data = await callApi.json();
    //console.log(data)
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
    //console.log(completeData)
    return completeData;
}
//getPeopleInfoAndName()
async function getWeather() {

}
const peopleTable = document.querySelector('.peopleTable')
async function createTable() {
    let html = '';
    let dataArr = ''
    if (localStorage.getItem("peopleInfo") == null) {
        dataArr = await getPeopleInfoAndName()
    }
    else {
        dataArr = JSON.parse(localStorage.getItem("peopleInfo"))
    }
    console.log(dataArr)
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
        <td class="tableData">
        <span class="tableText">${dataArr[i].city}</span>
        <input class="editInput" dataType="city" type="text">
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
        //editInputs[i].style.display = "block"
        if (currentTrData[i].className == 'tableData') {
            //console.log(currentTrData[i].childNodes[3]);
            currentTrData[i].childNodes[1].style.display = "block"
            currentTrData[i].childNodes[3].style.display = "none"
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
            let temp = '';//temp for input storage
            console.log(e.currentTarget.parentNode.parentNode.childNodes)
            console.log("row index: ", rowIndex)
            console.log(editRow[rowIndex])
            for (let i = 0; i < currentTrData.length; i++) {
                //editInputs[i].style.display = "block"
                if (currentTrData[i].className == 'tableData') {
                    //console.log(currentTrData[i].childNodes[3]);
                    currentTrData[i].childNodes[1].style.display = "none"
                    currentTrData[i].childNodes[3].style.display = "block"
                }
                
            }
            for (let i = rowIndex * 7; i < (rowIndex * 7 + 7); i++) {//checks input fields in row
                editInputs[i].value = tableText[i].textContent
            }
            //e.currentTarget.parentNode.parentNode.remove();
            // let idNum = e.currentTarget.getAttribute('personId')
        })
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
})
