import { fetchEmployees } from './index.js'
import { server } from './url.js'

const createCard = (name, role, i) => {
    const linkWrapper = document.createElement('a')
    // linkWrapper.setAttribute('href', 'profile.html')

    const cardContainer = document.createElement('div')
    cardContainer.classList.add('card')

    const largeText = document.createElement('p')
    largeText.textContent = name

    const smallText = document.createElement('p')
    smallText.textContent = role
    smallText.classList.add('role')
    smallText.classList.add('bold')

    cardContainer.id = i
    smallText.id = i
    largeText.id = i

    cardContainer.appendChild(largeText)
    cardContainer.appendChild(smallText)
    linkWrapper.appendChild(cardContainer)
    document.querySelector('#record').appendChild(linkWrapper)

    cardContainer.addEventListener('click', loadProfile)

}

export const initializeCards = (type) => {
    createCardContainer()

    var employees = localStorage.getItem('employees')
    employees = JSON.parse(employees)
    // console.log(employees)
    // const employees = [
    //     {
    //         'name': 'Mohamed Asif',
    //         'designation': 'Full Stack Engineer'
    //     }
    // ]

    for (let i = 0; i < employees.length; i++) {
        const employee = employees[i]
        // console.log(employee)
        createCard(employee.employee_name, employee.designation, i)
    }

}

const createCardContainer = () => {
    const container = document.createElement('div')
    container.classList.add('flex-column')
    container.id = "record"

    const parent = document.getElementById('results')
    const elem = document.getElementById('right-chevron')
    
    parent.insertBefore(container, elem)

}

const removeCardContainer = () => {
    document.getElementById('record').remove()
}

const createPageNumber = (currentPage, totalPages) => {
    const container = document.createElement('div')
    container.classList.add('center')

    const text = document.createElement('p')
    text.classList.add('font-grey')
    text.textContent = `Page ${currentPage} / ${totalPages ? totalPages : currentPage}`

    container.appendChild(text)
    document.querySelector(".container").appendChild(container)
}

const loadProfile = (event) => {
    // event.stopPropagation()
    const i = event.target.id
    var employees = localStorage.getItem('employees') 
    employees = JSON.parse(employees)
    // console.log(employees)  

    const details = {
        'employee_name': employees[i].employee_name,
        'designation': employees[i].designation
    };

    const data = JSON.stringify(details)
    // console.log(details)
    console.log(data)
    sendEmployeeDetail(data)
    // window.location.href("profile.html")
}

const searchProfile = async () => {
    try { 
        await fetchEmployees(1, 'one')
        removeCardContainer()
        initializeCards('search')
        updatePageNumber('search')
        greyLeftChevron()
        greyRightChevron()
    } catch (error) {
        alert(error)
        // Code below needs checking. Should be implemented in all async function calls
        if (error.slice(-7,) == "expired") {
            localStorage.clear()
            window.location.href = './login.html'
        }
    }
}

const sendEmployeeDetail = (data) => {
    // Assumption that I extracted the values
    console.log('Hello')
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${server}/employee_select`);

    xhr.onload = function (event) {
        const res = xhr.response
        console.log(res)
        if (xhr.status == 200) {
            window.location.href = './profile.html'
        }
        localStorage.setItem('employeeDetails', res)
    };


    var token = localStorage.getItem('token')
    token = `Bearer ${token}`

    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', token)
    xhr.send(data);
}

const changePage = (to) => {
    if ((currentPage < totalPages) && (to == 'next'))  {
        currentPage += 1
        renderPages()
    } else if ((currentPage > 1) && (to == 'prev')) {
        currentPage -= 1
        renderPages()
    }
}

const renderPages = async () => {
    try {
        var status = await fetchEmployees(currentPage, 'all')
        console.log(status)
        
        removeCardContainer()
        initializeCards('records')
        updatePageNumber('records')
    
        greyLeftChevron()
        greyRightChevron()
    } catch (error) {
        alert(error)
        if (error.slice(-7,) == "expired") {
            localStorage.clear()
            window.location.href = './login.html'
        }
    }
}

const updatePageNumber = (type) => {
    if (type == 'search') {
        currentPage = totalPages = localStorage.getItem('totalPages')
    }
    console.log(totalPages ? totalPages : currentPage)
    const pageNumber = document.querySelector('.font-grey')
    pageNumber.textContent = `Page ${currentPage} / ${totalPages ? totalPages : currentPage}`
}

const greyLeftChevron = () => {
    const leftChevron = document.getElementById('left-chevron-icon')
    if (currentPage == 1) {
        leftChevron.classList.add('opacity-30')
    } else {
        leftChevron.classList.remove('opacity-30')
    }
}

const greyRightChevron = () => {
    const rightChevron = document.getElementById('right-chevron-icon')
    if (currentPage == totalPages) {
        rightChevron.classList.add('opacity-30')
    } else {
        rightChevron.classList.remove('opacity-30')
    }
}   

const records = [
    {
        'name': 'Mohamed Asif',
        'designation': 'DevOps Engineer'
    },
    {
        'name': 'Mohamed Asif',
        'designation': 'DevOps Engineer'
    },
    {
        'name': 'Mohamed Asif',
        'designation': 'DevOps Engineer'
    },
    {
        'name': 'Mohamed Asif',
        'designation': 'DevOps Engineer'
    },
    {
        'name': 'Mohamed Asif',
        'designation': 'DevOps Engineer'
    },
    {
        'name': 'Mohamed Asif',
        'designation': 'DevOps Engineer'
    },
    {
        'name': 'Mohamed Asif',
        'designation': 'DevOps Engineer'
    },
    {
        'name': 'Mohamed Asif',
        'designation': 'DevOps Engineer'
    },
    {
        'name': 'Mohamed Asif',
        'designation': 'DevOps Engineer'
    },
    {
        'name': 'Mohamed Asif',
        'designation': 'DevOps Engineer'
    },
]


// Main
var currentPage = 1;
var totalPages = localStorage.getItem('totalPages')

// Get List of Employees
var employees = localStorage.getItem('employees')
employees = JSON.parse(employees)
// console.log(employees)

initializeCards('employee_list')
greyRightChevron()


// Changing Pages 
document.querySelector('.btn').addEventListener('click', searchProfile)
document.getElementById('right-chevron-icon').addEventListener('click', function () {
    changePage('next');
}) 
document.getElementById('left-chevron-icon').addEventListener('click', function () {
    changePage('prev');
}) 


createPageNumber(currentPage, totalPages)   