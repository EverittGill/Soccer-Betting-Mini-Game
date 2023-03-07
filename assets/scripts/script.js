
//grabbing user's zipcode

// let leagueID = leagueSelect.selectedIndex.value;

//sport api key = d9dabb12361e54cd2cf581721b2dc41a
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


let startButton = $(".start-button");

let leagueInputButton = $(".leagueInputButton");

leagueInputButton.click(getLeagueInput);

async function getCoordinates() {
    let zipcodeInput = parseInt($(".zipcode-input").val());
    let requestCoords = "https://dev.virtualearth.net/REST/v1/Locations/" + zipcodeInput +"?maxResults=5&key=AvYlPfJZ0g5bkrEGraC1mONNJQVi9XGtuaEvQKHIulGOxs3k8t1CmSse-NwO2YG1";
    let response = await fetch(requestCoords);
    let coordResponse = await response.json();
    let coordString = coordResponse.resourceSets[0].resources[0].point.coordinates.join(","); 
    console.log(coordString);
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
            "x-rapidapi-key": "d9dabb12361e54cd2cf581721b2dc41a"
        }
    });
    let fixtureResponse = await response.json();
    let fixtureID = fixtureResponse.response[0].fixture.id;
    let homeTeamName = fixtureResponse.response[0].teams.home.name;
    let awayTeamName = fixtureResponse.response[0].teams.away.name;
    getPredictions(fixtureID);
}

async function getPredictions(fixtureID) {
    let predictionRequest = "https://v3.football.api-sports.io/predictions?fixture=" + fixtureID;
    let response = await fetch(predictionRequest, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": "d9dabb12361e54cd2cf581721b2dc41a"
        }
    });
    let predictionResponse = await response.json();
    let predictedWinnerName = predictionResponse.response[0].predictions.winner.name;
    let predictedWinnerID = predictionResponse.response[0].predictions.winner.id;
    let predictedWinnerComment = predictionResponse.response[0].predictions.winner.comment;
}


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
