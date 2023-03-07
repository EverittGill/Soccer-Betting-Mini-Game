
//grabbing user's zipcode

// let leagueID = leagueSelect.selectedIndex.value;

//sport api key = d9dabb12361e54cd2cf581721b2dc41a
//sport api key 2 = f41f31c867591f46b21975bfac891312

//bing map key = AvYlPfJZ0g5bkrEGraC1mONNJQVi9XGtuaEvQKHIulGOxs3k8t1CmSse-NwO2YG1

//four major leagues to focus on
//user's choice, drop down list probably

//england premier league ID 39, season 2022
//uefa champions league ID 2, season 2022
//spain la liga league ID 140, season 2022
//bundesliga league ID 78, season 2022

//getting predictions required fixture ID (interger)

//getting fixture required league ID (interger) and season (interger YYYY)

/* fetching fixture id = fetch("https://v3.football.api-sports.io/fixtures?status=NS&league={LEAGUE-ID}&season={YYYY}", {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "XxXxXxXxXxXxXxXxXxXxXxXx"
    }
}); */

//extracting fixture id = response.fixture.id

/* fetching prediction using fixture id = fetch("https://v3.football.api-sports.io/predictions?fixture=198772", {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "XxXxXxXxXxXxXxXxXxXxXxXx"
    }
}) */

//extracting prediction infos:
//response.predictions.winner.name = winning team name
//response.predictions.winner.id = id of winning team, to get icons/flags 

//to search for local entities, need to convert zipcode into coordinates

//test coord string 33.97973251,-84.15020752

//test fixture id 868006


let startButton = $(".start-button");

let leagueInputButton = $(".leagueInputButton");

let sportAPIkey = "f41f31c867591f46b21975bfac891312"

let bingMapKey = "AvYlPfJZ0g5bkrEGraC1mONNJQVi9XGtuaEvQKHIulGOxs3k8t1CmSse-NwO2YG1"

leagueInputButton.click(getLeagueInput);

async function getCoordinates() {
    let zipcodeInput = parseInt($(".zipcode-input").val());
    let requestCoords = "https://dev.virtualearth.net/REST/v1/Locations/" + zipcodeInput +"?maxResults=5&key=" + bingMapKey;
    let response = await fetch(requestCoords);
    let coordResponse = await response.json();
    let coordString = coordResponse.resourceSets[0].resources[0].point.coordinates.join(","); 
    getDonuts(coordString);
    getLiquors(coordString);
}

async function getDonuts(coordString) {
    let requestDonuts = "https://dev.virtualearth.net/REST/v1/LocalSearch/?type=Donuts&userLocation=" + coordString + ",15000&maxResults=20&key=" + bingMapKey;
    let response = await fetch(requestDonuts);
    let donutsResponse = await response.json();
    generateDonutPlaces(donutsResponse);
}

function generateDonutPlaces(donutsResponse) {
    for (var i = 0; i < 5; i++) {
        let eachDonutName = donutsResponse.resourceSets[0].resources[i].name;
        let eachDonutAddress = donutsResponse.resourceSets[0].resources[i].Address.formattedAddress;
        let eachDonutListing = $("<p>").text(eachDonutName + " " + "(" + eachDonutAddress + ")");
        $(".container-fluid").append(eachDonutListing);
    }
}

async function getLiquors(coordString) {
    let requestLiquors = "https://dev.virtualearth.net/REST/v1/LocalSearch/?type=Bars&userLocation=" + coordString + ",15000&maxResults=20&key=" + bingMapKey;
    let response = await fetch(requestLiquors);
    let liquorsResponse = await response.json();
    generateLiquorPlaces(liquorsResponse);
}

function generateLiquorPlaces(liquorsResponse) {
    for (var i = 0; i <5; i++) {
        let eachBarName = liquorsResponse.resourceSets[0].resources[i].name;
        let eachBarAddress= liquorsResponse.resourceSets[0].resources[i].Address.formattedAddress;
        let eachBarListing = $("<p>").text(eachBarName + " " + "(" + eachBarAddress + ")");
        $(".container-fluid").append(eachBarListing);
    }
}



function getLeagueInput() {
    let leagueInput = parseInt(document.querySelector(".league-input").value);
    getFixtureID(leagueInput);
}

async function getFixtureID(leagueInput) {
    let fixtureRequest = "https://v3.football.api-sports.io/fixtures?status=NS&league="+ leagueInput + "&season=2022";
    let response = await fetch(fixtureRequest, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": sportAPIkey
        }
    });
    let fixtureResponse = await response.json();
    let fixtureID = fixtureResponse.response[0].fixture.id;
    getPredictions(fixtureID);
    generateTeams(fixtureResponse);
}

function generateTeams(fixtureResponse) {
    let homeTeamName = fixtureResponse.response[0].teams.home.name;
    let homeTeamLogo = fixtureResponse.response[0].teams.home.logo;
    let awayTeamName = fixtureResponse.response[0].teams.away.name;
    let awayTeamLogo = fixtureResponse.response[0].teams.away.logo;
    let homeLogo = $("<img>").attr({"src": homeTeamLogo});
    let awayLogo = $("<img>").attr({"src": awayTeamLogo});
    let homeTeam = $("<div>").append($("<p>").text(homeTeamName).addClass("teamName"), homeLogo).addClass("eachTeam");
    let awayTeam = $("<div>").append($("<p>").text(awayTeamName).addClass("teamName"), awayLogo).addClass("eachTeam");
    $(".container-fluid").append($("<div>").addClass("teamsContainer").append(homeTeam, awayTeam));
}

async function getPredictions(fixtureID) {
    let predictionRequest = "https://v3.football.api-sports.io/predictions?fixture=" + fixtureID;
    let response = await fetch(predictionRequest, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": sportAPIkey
        }
    });
    let predictionResponse = await response.json();
    let predictedWinnerID = predictionResponse.response[0].predictions.winner.id;
    let predictedWinnerComment = predictionResponse.response[0].predictions.winner.comment;
    generateWinner(predictionResponse);
}

function generateWinner(predictionResponse) {
    let predictedWinnerName = predictionResponse.response[0].predictions.winner.name;
    let winnerAnnounce = $("<h2>").text("Site Prediction: " + predictedWinnerName);
    $(".container-fluid").append(winnerAnnounce);
    localStorage.setItem("winner", predictedWinnerName);
}

$(".container-fluid").on("click", ".teamName", function () {
    let userPick = $(this).text();
    console.log(userPick);
    let userPickAnnounce = $("<h2>").text("User Prediction: " + userPick);
    $(".container-fluid").append(userPickAnnounce);
})

let leagueModal = document.querySelector(".league-modal");

function openModal() {

    // Add is-active class on the modal
    leagueModal.classList.add("is-active");
}

// Function to close the modal
function closeModal() {
    leagueModal.classList.remove("is-active");
}

// Add event listeners to close the modal
// whenever user click outside modal
document.querySelectorAll(".modal-background, .modal-close, .modal-card-head,.delete,.modal-card-foot,.button"
).forEach(($el) => {
    const $modal = $el.closest(".modal");
    $el.addEventListener("click", () => {

        // Remove the is-active class from the modal
        $modal.classList.remove("is-active");
    });
});

// Adding keyboard event listeners to close the modal
document.addEventListener("keydown", (event) => {
    const e = event || window.event;
    if (e.keyCode === 27) {

        // Using escape key
        closeModal();
    }
});

startButton.click(function() {
    openModal();
    getCoordinates();
});


