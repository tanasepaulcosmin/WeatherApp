// API KEY
const key = "2bde8d8e69c96898137b3bed455e0fef";
// Select the elements fromm HTML

const tempElement = document.querySelector(".temperature-value");
const descElement = document.querySelector(".temperature-description");
const locationElement = document.querySelector(".location");
const notificationElement = document.querySelector(".notification");

// We create an object where we will store the data 
const currentWeather = {
    // temperature = {
    //     value
    //     unit
    // },
    // description:
    // city:
    // country:

};

let cookieUnit = currentWeather.temperature = {
    unit : ""
}

// we define the Kelvin constnat which we will use in converting the fechted data into Farenheit or Celcius
const KELVIN = 273;


// Get the cuurent position of device using geolocation
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = 'Could not get location';
    
}

// Set the user`s position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// Get the weather from API
function getWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?&lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(response => response.json())
        .then((data) =>{
            currentWeather.temperature.value = Math.floor(data.main.temp - KELVIN);
            currentWeather.description = data.weather[0].description;
            currentWeather.iconId = data.weather[0].icon;
            currentWeather.city = data.name;
            currentWeather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}

// Display the weather from the API
function displayWeather(){
  
    tempElement.innerHTML = `${currentWeather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = currentWeather.description;
    locationElement.innerHTML = `${currentWeather.city}, ${currentWeather.country}`;
}

// We convert the temperature from Celcius to Farenheit
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// When we click on the temperature element, we can displat the temperature in the selected unit. The function checkTemp checks if temperature value is in Celcius, and converts it to Farenheit. 
// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function checkTemp(){
    
    if(cookieUnit === "celcius"){
        let fahrenheit = celsiusToFahrenheit(currentWeather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        cookieUnit === "farenheit";
    }else{
        tempElement.innerHTML = `${currentWeather.temperature.value}°<span>C</span>`;
        cookieUnit = "celcius"
    }
});


// set cookies 
function setCookie(cname,cvalue,exdays) {
    let date = new Date();
    date.setTime(date.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ":path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i =0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length,c.length);
        }
    return null;
}

setCookie('unit','celcius',9999);


tempElement.addEventListener('onclick', () =>{
    cookieUnit = getCookie('unit');

    if(cookieUnit ==='celcius'){
        setCookie('unit', 'farenheit', 9999);
        navigator.geolocation.getCurrentPosition(displayWeather);
    }
    else{
        setCookie('unit', 'celcius', 9999);
        navigator.geolocation.getCurrentPosition(displayWeather);
    }
}
)}

// set local storage

// tempElement.addEventListener('onclick', () =>{
//     unit = localStorage.getItem('unit');

//     if(unit ==='celcius'){
//     localStorage.setItem('unit', 'farenheit');
//     navigator.geolocation.getCurrentPosition(displayWeather);
//     }
//     else{
//     localStorage.setItem('unit', 'celcius');
//     navigator.geolocation.getCurrentPosition(displayWeather);
//     }

// });
