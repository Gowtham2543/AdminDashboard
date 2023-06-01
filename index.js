import { server } from "./url.js"

console.log(server);
export const fetchEmployees = (currentPage, numberOfRecords) => {
    return new Promise( function (resolve, reject) {

        console.log("Hello")
        var endpoint = 'employee_list' // Default
        if (numberOfRecords == "all") {
            var data = {
                'page_number': currentPage
            }
        } else {
            endpoint = 'employee_search'
            const name = document.getElementById('employee').value
            var data = {
                'employee_name': name
            }
        }
        data = JSON.stringify(data)
        
        var xhr = new XMLHttpRequest();

        xhr.open("POST", `${server}/${endpoint}`); 
    
        xhr.onload = function () { 
            const res = JSON.parse(xhr.response)
            const statusMsg = res.status ? res.status : res.msg
            console.log(xhr.response)

            localStorage.setItem('employees', JSON.stringify(res.employee_list ? res.employee_list : [res]))
            localStorage.setItem('totalPages', res.total_pages ? res.total_pages : 1)
            
            var statusCode = xhr.status
            if (statusCode == 200) {
                resolve(statusCode)
            } else {
                reject(statusMsg)
            }
        }; 
    
        var token = localStorage.getItem('token')
        token = `Bearer ${token}`
    
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.setRequestHeader('Authorization', token)
        xhr.send(data);
    })

}

const addSearchButtonListener = () => {
    const search = document.getElementById('search')
    if (search) {
        search.addEventListener('click', async function() {
            try {
                var status = await fetchEmployees(1, 'all')
                console.log(status)
            } catch (error) {
                alert(error)
                if (error.slice(-7,) == "expired") {
                    localStorage.clear()
                    window.location.href = './login.html'
                } 
            } finally {
                if (status == 200) {
                    window.location.href = './employee.html'
                } 
            }
        })
    }
}

const checkIfLoggedIn = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        window.location.href = './login.html'
    }
}

// Main
checkIfLoggedIn()
addSearchButtonListener()


// Response
    // {
    //     "employee_list": [
    //         {
    //             "designation": "Manager",
    //             "employee_name": "SivaGuru"
    //         },
    //         {
    //             "designation": "Manager",
    //             "employee_name": "Balamurugan"
    //         },
    //         {
    //             "designation": "Manager",
    //             "employee_name": "Balamurugan_32232"
    //         },
    //         {
    //             "designation": "Manager",
    //             "employee_name": "Balamurugan_32232_767766"
    //         }
    //     ],
    //     "total_pages": 1
    // }