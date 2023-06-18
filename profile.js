import {server} from './url.js';

const initializeProfile = () => {
    var info = localStorage.getItem('employeeDetails')
    info = JSON.parse(info)
    console.log(info.first_name)
    // const info = {
    //     'first_name': 'Mohamed', 
    //     'last_name': 'Asif', 
    //     'age': '20', 
    //     'designation': 'DevOps Engineer', 
    //     'emp_id': '8726487', 
    //     'dob': '10-09-2002', 
    //     'email': 'manojganesan@gmail.com', 
    //     'attendance_percent': '86 %', 
        
    // }

    const details = document.createElement('div')
    details.classList.add('details')

    let saveDetails = document.createElement('button')
    saveDetails.classList.add('save')
    saveDetails.textContent = 'Save Details'
    details.append(saveDetails)


    var centerDiv = document.createElement('div')
    centerDiv.classList.add('center')
    centerDiv.classList.add('mb-20')
    
    var container = document.createElement('div')
    container.classList.add('flex-row')
    container.classList.add('font-large')
    
    var field = document.createElement('p')
    field.classList.add('field')
    field.classList.add('eid')
    field.textContent = "EID : "
    var value = document.createElement('p')
    value.textContent = info.emp_id
    value.classList.add('value')
    container.appendChild(field)
    container.appendChild(value)

    centerDiv.appendChild(container)
    details.append(centerDiv)

    const row = document.createElement('div')
    row.classList.add('flex-row')
    row.classList.add('center')
    row.classList.add('gap-20')

    var column = document.createElement('div')
    column.classList.add('flex-column')

    // Div
    container = document.createElement('div')
    // Field
    field = document.createElement('p')
    field.classList.add('field')
    field.textContent = "First Name"
    // Value
    value = document.createElement('input')
    value.classList.add('value')
    value.value = info.first_name
    container.appendChild(field)
    container.appendChild(value)
    column.appendChild(container)

    // Div
    container = document.createElement('div')
    field = document.createElement('p')
    field.classList.add('field')
    field.textContent = "Last Name"
    value = document.createElement('input')
    value.classList.add('value')
    value.value = info.last_name
    container.appendChild(field)
    container.appendChild(value)
    column.appendChild(container)

    container = document.createElement('div')
    field = document.createElement('p')
    field.classList.add('field')
    field.textContent = "DOB"
    value = document.createElement('input')
    value.classList.add('value')
    value.value = info.dob
    container.appendChild(field)
    container.appendChild(value)
    column.appendChild(container)
    
    // Next Column
    const anotherColumn = document.createElement('div')
    anotherColumn.classList.add('flex-column')

    container = document.createElement('div')
    field = document.createElement('p')
    field.classList.add('field')
    field.textContent = "Designation"
    value = document.createElement('input')
    value.classList.add('value')
    value.value = info.designation
    container.appendChild(field)
    container.appendChild(value)
    anotherColumn.appendChild(container)

    container = document.createElement('div')
    field = document.createElement('p')
    field.classList.add('field')
    field.textContent = "Age"
    value = document.createElement('input')
    value.classList.add('value')
    value.value = info.age
    container.appendChild(field)
    container.appendChild(value)
    anotherColumn.appendChild(container)

    container = document.createElement('div')
    field = document.createElement('p')
    field.classList.add('field')
    field.textContent = "Email"
    value = document.createElement('input')
    value.classList.add('value')
    value.classList.add('w-270')
    value.classList.add('mb-5')
    value.value = info.email
    container.appendChild(field)
    container.appendChild(value)
    anotherColumn.appendChild(container)

    row.appendChild(column)
    row.appendChild(anotherColumn)
    details.appendChild(row)

    // Attendance Percentage
    centerDiv = document.createElement('div')
    centerDiv.classList.add('center')

    const attendanceDiv = document.createElement('div')
    attendanceDiv.classList.add('flex-row')
    attendanceDiv.classList.add('font-xxl')
    attendanceDiv.classList.add('mt-40')

    field = document.createElement('p')
    field.classList.add('field')
    field.textContent = "Attendance : "
    value = document.createElement('p')
    value.classList.add('value')
    value.textContent = info.attendance_percent

    attendanceDiv.appendChild(field)
    attendanceDiv.appendChild(value)
    centerDiv.append(attendanceDiv)
    details.appendChild(centerDiv)

    document.querySelector('.profile').appendChild(details)
}

const checkIfLoggedIn = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        window.location.href = './login.html'
    }
}

const sendFormData = (formData) => {
    return new Promise( function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `${server}/employee_details_update`); 
    
        // This fires up when the connection is successful
        xhr.onload = function(event){ 
            const res = JSON.parse(xhr.response)
            console.log(xhr.response)
    
            var statusMessage = res.status ? res.status : res.msg
    
            if (xhr.status == 200) {
                resolve(xhr.status)
            } else {
                reject(statusMessage)
            }
        }; 
    
        var token = localStorage.getItem('token')
        token = `Bearer ${token}`
        
        
        xhr.setRequestHeader('Authorization', token)
        xhr.send(formData);
    })
}


const isUpdated = (details) => {
    details.sort()

    let data = JSON.parse(localStorage.getItem('employeeDetails'))
    data = Object.values(data).sort()

    const match = data.filter((currentItem, index) => 
        {
            return data[index] == details[index]
        }
     )

     console.log("Matched", match);
    return match.length != data.length

}

const saveDetails = () => {
    const values = document.querySelectorAll('.value');    
    const detailList = [...values]
    const details = detailList.map((detail) => detail?.value ?? detail.textContent)
    
    if (!isUpdated(details)) {
        alert("Nothing to update")

    } else {
        const formData = new FormData();
        formData.set('empId', values[0].textContent) 
        formData.set('firstName', values[1].value)
        formData.set('lastName', values[2].value)
        formData.set('date', values[3].value)
        formData.set('designation', values[4].value)
        formData.set('age', values[5].value)
        formData.set('email', values[6].value)
    
        sendFormData(formData).then(() => alert('Data Sent!'))
    }

    

}

checkIfLoggedIn()
initializeProfile()

document.querySelector('.save').addEventListener('click', saveDetails)