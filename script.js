$(document).ready(function(){
   
    var cityArray=[];
    var APIKey = "258635a5e9f4d564a966e4ce880b065d";
    $("#weatherBox").hide();

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
    $("#searchBtn").on("click",function(){
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
            var currentDate = moment().format("MM/DD/YYYY");
            var spanDate=$("<span>").text(" (" + currentDate +")");
            $("h4").append(spanDate);
            $("h4").append(imgDiv);

            //temperature
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            tempF=tempF.toFixed(2);
            $("#temperature").text("Temperature: " + tempF + " °F");

            //humidity and wind speed
            $("#humidity").text("Humidity: " + response.main.humidity + " %");
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");

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
                    var uvNumber = uvData.value;

                    $("#UV").text("UV Index: ");
                    var spanEle = $("<span>").text(uvNumber);
                    $("#UV").append(spanEle);
                    

                    if(uvNumber<3){
                        spanEle.removeClass("low moderate high veryHigh extreme").addClass("low");
                        
                    }else if(uvNumber>=3 && uvNumber<6){
                        spanEle.removeClass("low moderate high veryHigh extreme").addClass("moderate");
                 
                    }else if(uvNumber>=6 && uvNumber<8){
                        spanEle.removeClass("low moderate high veryHigh extreme").addClass("high");
                      
                    }else if(uvNumber>=8 && uvNumber<11){
                        spanEle.removeClass("low moderate high veryHigh extreme").addClass("veryHigh");
                       
                    }else{
                        spanEle.removeClass("low moderate high veryHigh extreme").addClass("extreme");
                       
                    }

                 $("#weatherBox").show();  
                })

            // 5 days forecast
             var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+APIKey;
                
             $("#forecast").text("5-Day Forecast: ");

                $.ajax({
                    url:forecastURL,
                    method:"GET"
                }).then(function(forecastData){
                    console.log(forecastData);

                    // console.log(forecastDate.list[0].dt_txt);

                    for(var i=0; i<forecastData.list.length; i++){
                        if (forecastData.list[i].dt_txt.indexOf("15:00:00")!== -1){

                            var newCardDiv = $("<div>").addClass("card");

                            // var colDiv=$("<div>").addClass("col-2");

                            var forecastDate = $("<h5>").text(forecastData.list[i].dt_txt);

                            var newIcon = forecastData.list[i].weather[0].icon;
                        
                            var newIconURL = "http://openweathermap.org/img/wn/"+newIcon+"@2x.png";
                            var imgIcon = $("<img>").attr("src",newIconURL);
                  
                            var tempFF = (forecastData.list[i].main.temp - 273.15) * 1.80 + 32;
                            tempFF=tempFF.toFixed(2);
                            var tempElement = $("<p>").text("Temp: " + tempFF +" °F");

                            var humElement = $("<p>").text("Humidity: " + forecastData.list[i].main.humidity +"%");

                            newCardDiv.append(forecastDate, imgIcon,tempElement,humElement);
                            $("#forecastBox").append(newCardDiv);

                            // colDiv.append(newCardDiv);



                        }



                    }

                })
        })



    })














})