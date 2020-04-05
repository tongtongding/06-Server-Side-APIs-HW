$(document).ready(function(){
   
    var cityArray=[];
    var APIKey = "258635a5e9f4d564a966e4ce880b065d";
   
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

    function addCity(city){
        var ulElement=$("ul");
        var liElement=$("<li>");
        liElement.attr("class","list-group-item");
        liElement.text(city);
        ulElement.append(liElement);

    }

    $("#search").on("click",function(){
        event.preventDefault();
        var city = $("#userInput").val().trim();
        $("#userInput").val("");
        if(city===""){
            return
        }

    
        if(cityArray.indexOf(city)===-1){
            addCity(city);
            cityArray.push(city);
            localStorage.setItem("cityList",JSON.stringify(cityArray));

        }
        
        
        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+APIKey;
        var uvURL="";
        
        $.ajax({
            url:weatherURL,
            method:"GET"
        }).then(function(response){
            console.log(response);
            console.log(response.name);
            var icon = response.weather[0].icon
            var iconURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
            var lon=response.coord.lon;
            var lat=response.coord.lat;
            uvURL="http://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat="+lat+"&lon="+
            lon;
            $("#cityName").text(response.name);
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            tempF=tempF.toFixed(2);
            var imgDiv=$("<img>")
            imgDiv.attr("src",iconURL)
            $("h4").append(imgDiv)
            $("#temperature").text("Temperature: " + tempF);
            $("#humidity").text("Humidity: " + response.main.humidity);
            $("#windSpeed").text("Wind Speed: " + response.wind.speed);
            // var uvDiv=$("<img>")
            // uvDiv.attr("src",uvURL);
            // $("#UV").append(uvURL);
        })

        // $.ajax({
        //     url:uvURL,
        //     method:"GET"
        // }).then(function(uvData){
        //     console.log(uvData);



        // })


    })














})