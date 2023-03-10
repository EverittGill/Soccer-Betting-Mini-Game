
//sport api key 1 = d9dabb12361e54cd2cf581721b2dc41a
//sport api key 2 = f41f31c867591f46b21975bfac891312
//sport api key 3 = bdec72c0d6f6665831cd2a9bb3dfcb0e
//sport api key 4 = 369e2258babf267fa4d128d8c9c1acdc

//bing map key = AvYlPfJZ0g5bkrEGraC1mONNJQVi9XGtuaEvQKHIulGOxs3k8t1CmSse-NwO2YG1


//test coord string 33.97973251,-84.15020752

//test fixture id 868006


let startButton = $(".start-button");
let leagueInputButton = $(".leagueInputButton");
let donutButton = $(".donutButton");
let barsButton = $(".barsButton");
let playAgainButton = $(".playAgainButton");


let sportAPIkey = "bdec72c0d6f6665831cd2a9bb3dfcb0e"
let bingMapKey = "AvYlPfJZ0g5bkrEGraC1mONNJQVi9XGtuaEvQKHIulGOxs3k8t1CmSse-NwO2YG1"
var coordStringGlobal ="";

leagueInputButton.click(getLeagueInput);
donutButton.click(getDonuts);
barsButton.click(getLiquors);

playAgainButton.click(function(){
    window.location.reload();
    return false;
})


async function getCoordinates() {
    let zipcodeInput = parseInt($(".zipcode-input").val());
    let requestCoords = "https://dev.virtualearth.net/REST/v1/Locations/" + zipcodeInput +"?maxResults=5&key=" + bingMapKey;
    let response = await fetch(requestCoords);
    let coordResponse = await response.json();
    let coordString = coordResponse.resourceSets[0].resources[0].point.coordinates.join(","); 
    return coordStringGlobal = coordString;
}

async function getDonuts() {
    let requestDonuts = "https://dev.virtualearth.net/REST/v1/LocalSearch/?type=Donuts&userLocation=" + coordStringGlobal + ",50000&maxResults=5&key=" + bingMapKey;
    let response = await fetch(requestDonuts);
    let donutsResponse = await response.json();
    generateDonutPlaces(donutsResponse);
}

function generateDonutPlaces(donutsResponse) {
    $(".sectionTeam").addClass("displayNone");
    $(".sectionFoodDrink").removeClass("displayNone");
    let flavorText = $("<h4>").text("Thank you for playing! Have good time!")
    $(".sectionFoodDrink").append(flavorText);
    for (var i = 0; i < 5; i++) {
        let eachDonutName = donutsResponse.resourceSets[0].resources[i].name;
        let eachDonutAddress = donutsResponse.resourceSets[0].resources[i].Address.formattedAddress;
        let eachDonutListing = $("<p>").text(eachDonutName + " " + "(" + eachDonutAddress + ")");
        $(".sectionFoodDrink").append(eachDonutListing);
    }
}

async function getLiquors() {
    let requestLiquors = "https://dev.virtualearth.net/REST/v1/LocalSearch/?type=Bars&userLocation=" + coordStringGlobal + ",50000&maxResults=5&key=" + bingMapKey;
    let response = await fetch(requestLiquors);
    let liquorsResponse = await response.json();
    generateLiquorPlaces(liquorsResponse);
}

function generateLiquorPlaces(liquorsResponse) {
    $(".sectionTeam").addClass("displayNone");
    $(".sectionFoodDrink").removeClass("displayNone");
    let flavorText = $("<h4>").text("Thank you for playing! Please drink responsibly!")
    $(".sectionFoodDrink").append(flavorText);
    for (var i = 0; i <5; i++) {
        let eachBarName = liquorsResponse.resourceSets[0].resources[i].name;
        let eachBarAddress= liquorsResponse.resourceSets[0].resources[i].Address.formattedAddress;
        let eachBarListing = $("<p>").text(eachBarName + " " + "(" + eachBarAddress + ")");
        $(".sectionFoodDrink").append(eachBarListing);
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
    $(".sectionIntro").addClass("displayNone");
    let homeTeamName = fixtureResponse.response[0].teams.home.name;
    let homeTeamLogo = fixtureResponse.response[0].teams.home.logo;
    let awayTeamName = fixtureResponse.response[0].teams.away.name;
    let awayTeamLogo = fixtureResponse.response[0].teams.away.logo;
    let homeLogo = $("<img>").attr({"src": homeTeamLogo, "class": "eachTeamLogo"});
    let awayLogo = $("<img>").attr({"src": awayTeamLogo, "class": "eachTeamLogo"});
    let homeTeam = $("<div>").append($("<p>").addClass("title is-1 button is-info has-text-white is-family-sans-serif is-italic teamName").text(homeTeamName), homeLogo).addClass("eachTeam block");
    let awayTeam = $("<div>").append($("<p>").addClass("title is-1 button is-info has-text-white is-family-sans-serif is-italic teamName").text(awayTeamName), awayLogo).addClass("eachTeam block");
    $(".sectionTeam").append($("<div>").addClass("teamsContainer").append(homeTeam, awayTeam));
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
    generateWinner(predictionResponse);
}

function generateWinner(predictionResponse) {
    let predictedWinnerName = predictionResponse.response[0].predictions.winner.name;
    localStorage.setItem("siteWinner", predictedWinnerName);
}

$(".container-fluid").on("click", ".teamName", function () {
    let userPick = $(this).text();
    localStorage.setItem("userWinner", userPick);
    comparePredictions();
    $(".teamName").addClass("disabled");
})

function comparePredictions() {
    let retrieveSiteWinner = localStorage.getItem("siteWinner");
    let retrieveUserWinner = localStorage.getItem("userWinner");

    let winnerAnnounce = $("<h2>").text("Our Prediction: " + retrieveSiteWinner);
    let userPickAnnounce = $("<h2>").text("Your Prediction: " + retrieveUserWinner);
    $(".sectionTeam").append(winnerAnnounce, userPickAnnounce);

    if (retrieveSiteWinner === retrieveUserWinner) {
        announceWin();
        getCoordinates();
        $(".donutButton").removeClass("displayNone");
    } else {
        announceLost();
        getCoordinates();
        $(".barsButton").removeClass("displayNone");
    };
}

function announceWin() {
    let winText = $("<h3>").text("Oh wow! We have so much in common!").addClass("resultAnnounce");
    $(".sectionTeam").append(winText);
}

function announceLost() {
    let lostText = $("<h3>").text("Uh oh! I wouldn't bet too much if I was you.").addClass("resultAnnounce");
    $(".sectionTeam").append(lostText);
}

let leagueModal = document.querySelector(".league-modal");


//Bulma code block

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
        leagueModal.classList.remove("is-active");
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
});
