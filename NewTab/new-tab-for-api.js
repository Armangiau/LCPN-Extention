//"use strict";
// récupère les donnés JSON
import * as methodes from "./methods.js";

const dynamicCheckedBox = document.querySelector("#dynamicCheck");

if (document.cookie == "check=true") {
  dynamicCheckedBox.checked = true;
}
dynamicCheckedBox.addEventListener('change', ()=>{
  if(dynamicCheckedBox.checked){
    document.cookie = "check=true"
    location.href = "./new-tab-for-api.html"
  } else {
    document.cookie = "check=false"
    location.href = "./new-tab-for-api.html"
  }
})  

fetch("../Ressources/messages.json")
  .then((response) => response.json())
  .then(function (data) {
    staticDataLoaded(data);
    const firstTableLength = data.length;
    if (document.cookie === "check=true") {
      fetch("../Ressources/messages.json")
      .then((response) => response.json())
      .then(function (response) {
        dynamicDataLoaded(response, firstTableLength);
      })
      .catch(function (error) {
        console.log("Désolé une erreur est survenue lors du chargement du contenu dynamique : " + error);
        methodes.readyToInteract(firstTableLength);
      });
    } else {
      methodes.readyToInteract(firstTableLength);
    }
  })
  .catch(function (error) {
    console.log(error);
  });

function staticDataLoaded(data) {
  methodes.melangeTableau(data);
  let content = "";

  const { messages, points } = methodes.createContent(
    data,
    `<button id="button-left">&#x1F448;&#x1F3FB;</button><button id="button-right">&#x1F449;&#x1F3FB;</button><div class="content-container">`
  );

  content += messages;
  content += "</div><div class='position-message'>";
  content += points;
  content += "</div>";

  document.querySelector(".message-container").innerHTML = content;
}

function dynamicDataLoaded(data, firstTableLength) {
  const count = data.length + firstTableLength;

  const { messages, points } = methodes.createContent(data);

  document
    .querySelector(".position-message")
    .insertAdjacentHTML("afterbegin", points);

  document
    .querySelector(".content-container")
    .insertAdjacentHTML("afterbegin", messages);

  methodes.readyToInteract(count);
}

// Empêcher que la recherche soit envoyée s'il n'y a rien d'écrit dans le champ
document.querySelector("form").addEventListener("submit", (e) => {
  if (document.getElementById("q").value === "") {
    e.preventDefault();
    return;
  }
});
