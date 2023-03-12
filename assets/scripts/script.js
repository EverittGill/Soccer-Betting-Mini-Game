
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


let sportAPIkey = "f41f31c867591f46b21975bfac891312"
let bingMapKey = "AvYlPfJZ0g5bkrEGraC1mONNJQVi9XGtuaEvQKHIulGOxs3k8t1CmSse-NwO2YG1"
var coordStringGlobal ="";

leagueInputButton.click(getLeagueInput);
donutButton.click(getDonuts);
barsButton.click(getLiquors);

playAgainButton.click(function(){
    localStorage.clear();
    window.location.reload();
    return false;
})


async function getCoordinates() {
    let zipcodeInput = parseInt($(".zipcode-input").val());
    let requestCoords = "https://dev.virtualearth.net/REST/v1/Locations/" + zipcodeInput +"?maxResults=5&key=" + bingMapKey;
    let response = await fetch(requestCoords);
    if (response.ok) {
        let coordResponse = await response.json();
        let coordString = coordResponse.resourceSets[0].resources[0].point.coordinates.join(","); 
        return coordStringGlobal = coordString;    
    } else {
        console.log("can't get coordinates");
        return;
    }
}

async function getDonuts() {
    let requestDonuts = "https://dev.virtualearth.net/REST/v1/LocalSearch/?type=Donuts&userLocation=" + coordStringGlobal + ",50000&maxResults=5&key=" + bingMapKey;
    let response = await fetch(requestDonuts);
    if (response.ok) {
        let donutsResponse = await response.json();
        generateDonutPlaces(donutsResponse);    
    } else {
        console.log("can't get donuts");
        return;
    }
}

function generateDonutPlaces(donutsResponse) {
    $(".sectionTeam").addClass("displayNone");
    $(".sectionFoodDrink").removeClass("displayNone");
    let flavorText = $("<h4>").text("Congratulations!\n Your prediction matches our experts' prediction so go out and stuff your face with donuts. Here's a list of donut shops near you!\n Have fun watching the game knowing that there's some so called expert who agrees with your opinion.")
    $(".sectionFoodDrink").append(flavorText);
    for (var i = 0; i < donutsResponse.resourceSets[0].estimatedTotal; i++) {
        let eachDonutName = donutsResponse.resourceSets[0].resources[i].name;
        let eachDonutAddress = donutsResponse.resourceSets[0].resources[i].Address.formattedAddress;
        let eachDonutListing = $("<p>").text(eachDonutName + " " + "(" + eachDonutAddress + ")");
        $(".sectionFoodDrink").append(eachDonutListing);
    }
}

async function getLiquors() {
    let requestLiquors = "https://dev.virtualearth.net/REST/v1/LocalSearch/?type=Bars&userLocation=" + coordStringGlobal + ",50000&maxResults=5&key=" + bingMapKey;
    let response = await fetch(requestLiquors);
    if (response.ok) {
        let liquorsResponse = await response.json();
        generateLiquorPlaces(liquorsResponse);    
    } else {
        console.log("can't get bars");
        return;
    }
}

function generateLiquorPlaces(liquorsResponse) {
    $(".sectionTeam").addClass("displayNone");
    $(".sectionFoodDrink").removeClass("displayNone");
    let flavorText = $("<h4>").text("Sorry about that, our experts think the other team will win. Prepare yourself for a loss anyway you have to. Here's a list of bars near you!\nThank you for playing and please drink responsibly.")
    $(".sectionFoodDrink").append(flavorText);
    for (var i = 0; i < liquorsResponse.resourceSets[0].estimatedTotal; i++) {
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
    
    if (response.ok) {
        let fixtureResponse = await response.json();
        let fixtureID = fixtureResponse.response[0].fixture.id;
        getPredictions(fixtureID);
        generateTeams(fixtureResponse);    
    } else {
        console.log("can't get fixture ID, key's used up, key change requires")
        return;
    }
}

function generateTeams(fixtureResponse) {
    $(".sectionIntro").addClass("displayNone");
    let homeTeamName = fixtureResponse.response[0].teams.home.name;
    let homeTeamLogo = fixtureResponse.response[0].teams.home.logo;
    let awayTeamName = fixtureResponse.response[0].teams.away.name;
    let awayTeamLogo = fixtureResponse.response[0].teams.away.logo;

    let pageInstructions =  $("<div>").append($("<p>").text("Choose the team you think will win in the next match").addClass("is-7-on-desktop sports-font background-orange border-white mb-6"));
    let vsText =  $("<div>").append($("<p>").text("Versus").addClass("is-size-1-desktop is-size-1-mobile sports-font is-half is-offset-one-quarter-mobile mt-2 mb-5"));
    let homeLogo = $("<img>").attr({"src": homeTeamLogo, "class": "eachTeamLogo"});
    let awayLogo = $("<img>").attr({"src": awayTeamLogo, "class": "eachTeamLogo"});
    let homeTeam = $("<div>").append($("<p>").addClass("column is-half-desktop is-full-mobile is-offset-one-quarter-desktop title is-3 button is-info has-text-white is-family-sans-serif is-italic teamName").text(homeTeamName), homeLogo).addClass("eachTeam block is-centered teamName");
    let awayTeam = $("<div>").append($("<p>").addClass("column is-half-desktop is-full-mobile is-offset-one-quarter-desktop title is-3 button is-info has-text-white is-family-sans-serif is-italic teamName").text(awayTeamName), awayLogo).addClass("eachTeam block teamName");
    let donutButton = $("<div>").append($("button").addClass("displayNone button is-normal is-primary"))
    $(".sectionTeam").append($("<div>").addClass("teamsContainer background-with-border").append(pageInstructions, homeTeam, vsText, awayTeam, donutButton));
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
    if (response.ok) {
        let predictionResponse = await response.json();
        generateWinner(predictionResponse);    
    } else {
        console.log("can't get prediction");
        return;
    }
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
    debugger;
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
    let lostText = $("<h3>").text("Our experts think you're wrong. Prepare yourself for loss my friend.").addClass("resultAnnounce");
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
        $(".sectionIntro").hide();
        $(".sectionTeam").show();
    }
});

startButton.click(function() {
    openModal();
});
