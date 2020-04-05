$(document).ready(function(){
   
    var cityArray=[];
    var APIKey = "258635a5e9f4d564a966e4ce880b065d";

   //get history form localstorage
   function getHistory(){

       var history = localStorage.getItem("cityList");
       if(history){
           cityArray=JSON.parse(history);
           for(var i=0;i<cityArray.length;i++){
               addCity(cityArray[i]);
           }
       }

   }
   getHistory();


    //city list
    function addCity(city){
        var ulElement=$("ul");
        var liElement=$("<li>");
        liElement.attr("class","list-group-item");
        liElement.text(city);
        ulElement.append(liElement);

    }

    //add click event for search button
    $("#search").on("click",function(){
        event.preventDefault();
        var city = $("#userInput").val();
        $("#userInput").val("");
        if(city===""){
            return
        };
  
        if(cityArray.indexOf(city)===-1){
            addCity(city);
            cityArray.push(city);
            localStorage.setItem("cityList",JSON.stringify(cityArray));

        };
        
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+APIKey;
        var uvURL="";
        
        $.ajax({
            url:weatherURL,
            method:"GET"
        }).then(function(response){
            console.log(response);

            //city name and icon
            var icon = response.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
            $("#cityName").text(response.name);
            var imgDiv=$("<img>");
            imgDiv.attr("src",iconURL);
            $("h4").append(imgDiv);

            //temperature
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            tempF=tempF.toFixed(2);
            $("#temperature").text("Temperature: " + tempF +"F");

            //humidity and wind speed
            $("#humidity").text("Humidity: " + response.main.humidity);
            $("#windSpeed").text("Wind Speed: " + response.wind.speed);

            //UV
            var lon=response.coord.lon;
            var lat=response.coord.lat;
            uvURL="http://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+lat+"&lon="+
            lon;
    
                $.ajax({
                    url:uvURL,
                    method:"GET"
                }).then(function(uvData){
                    console.log(uvData);
                    $("#UV").text("UV Index: " + uvData.value)
                })


             var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+APIKey;
                
             $("#forecast").text("5-Day Forecast: ");

                $.ajax({
                    url:forecastURL,
                    method:"GET"
                }).then(function(forecastDate){
                    console.log(forecastDate);

                })
        })



    })














})