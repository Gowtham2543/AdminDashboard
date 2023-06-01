import { server } from "./url.js"

const displayErrorMessage = (message) => {

    if (document.getElementById('error-message')) { 
        const m = document.getElementById('error-message')
        m.parentNode.removeChild(m)
    } 
        const msg = document.createElement('p')
        msg.id = "error-message"
        msg.textContent = message
        msg.classList.add('shake')


    const node = document.getElementById('btn')
    const parent = node.parentNode

    parent.insertBefore(msg, node)
}

const sendFormData = () => {
    return new Promise( function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `${server}/employee_details`); 
    
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
        
        const form = document.getElementById("signup-form")
        const formData = new FormData(form); 
        
        xhr.setRequestHeader('Authorization', token)
        xhr.send(formData);
    })
}

const checkIfLoggedIn = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        window.location.href = './login.html'
    }
}

checkIfLoggedIn()
document.getElementById('submit').addEventListener('click', async () => {
    
    try { 
        var status = await sendFormData()
    } catch (error) {
        alert(error)
        if (error.slice(-7,) == "expired") {
            localStorage.clear()
            window.location.href = './login.html'
        } 
    } finally {
        if (status == 200) {
            alert("User successfully created")
            window.location.href = "./index.html"
        }
    }
})