$(document).ready(function(){

    var city = $("#userInput").val().trim();
    var APIKey = "258635a5e9f4d564a966e4ce880b065d";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+APIKey;



    $("#search").on("click",function(){
        event.preventDefault();
        var ulElement=$("ul");
        var liElement=$("<li>");
        liElement.attr("class","list-group-item");
        liElement.text(JSON.stringify(city));
        ulElement.append(liElement)

        
        $.ajax({
            url:queryURL,
            method:"GET"
        }).then(function(response){
            console.log(response);
    
    
        })


    })














})