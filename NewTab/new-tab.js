"use strict";
// récupère les donnés JSON
fetch(
  "https://raw.githubusercontent.com/Armangiau/LCPN-extention/main/Ressources/messages.json"
)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    dataLoaded(data);
  })
  .catch(function (err) {
    console.log("error: " + err);
  });

function dataLoaded(data) {
  // trie le tableau de manière aléatoire que j'ai un peu pompé https://www.delftstack.com/fr/howto/javascript/shuffle-array-javascript/#m%C3%A9langer-un-tableau-en-utilisant-l-algorithme-de-m%C3%A9lange-de-fisher-yates

  function fisherYatesShuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); //random index
      [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
    }
  }
  fisherYatesShuffle(data);
  // insère les donnés du json dans le HTML et intèrpète le markdown
  //! dans le json il faut utiliser #li li# , #ul ul# pour avoir une liste, #s s# pour avoir un strong et #br pour avoir un saut de ligne #a le lien #a# le contenu du lien a# pour avoir un lien
  let content = `<button id="button-left">&#x1F448;&#x1F3FB;</button><button id="button-right">&#x1F449;&#x1F3FB;</button><div class="content-container">`;
  let PointIncrement = 0;
  let points = "";
  data.forEach((obj) => {
    if (typeof obj.titre === "string" && typeof obj.contenu === "string") {
      PointIncrement++;
      obj.titre = obj.titre
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
      obj.contenu = obj.contenu
        .replace(/&/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;")
        .replace(/#li /gi, "<li>")
        .replace(/ li#/gi, "</li>")
        .replace(/#ul /gi, "<ul>")
        .replace(/ ul#/gi, "</ul>")
        .replace(/#s /gi, "<strong>")
        .replace(/ s#/gi, "</strong>")
        .replace(/#br /gi, "<br>")
        .replace(/#a#/gi, '">')
        .replace(/#a/gi, '<a href="')
        .replace(/a#/gi, "</a>");
      content += `<div class="message"><h2>${obj.titre}</h2>`;
      if (
        obj.img &&
        obj.imgDescript &&
        typeof obj.img === "string" &&
        typeof obj.imgDescript === "string"
      ) {
        obj.img = obj.img
          .replace(/&/g, "&amp;")
          .replace(/>/g, "&gt;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;");
        obj.imgDescript = obj.imgDescript
          .replace(/&/g, "&amp;")
          .replace(/>/g, "&gt;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;");
        content += `<img src="${obj.img}" alt="${obj.imgDescript}" loading="lazy" height="500">`;
      }
      content += "<p>" + obj.contenu + "</p></div>";
      points += `<div class='point' id="${PointIncrement}"></div>`;
    }
  });
  content += "</div><div class='position-message'>";
  content += points;
  content += "</div>";
  //console.log(content);
  document.querySelector(".message-container").innerHTML = content;

  document.querySelectorAll("div.point").forEach((point) => {
    point.addEventListener("click", (e) => {
      LastPosition = position;
      position = Number(e.target.id);
      //console.log(position);
      position = GoToPosition(position, LastPosition);
    });
  });

  // on crée un système de diapos permettant à l'utilisateur de naviguer entre les messssages
  //* Utilise la flèche droite et gauche du clavier pour voir ce que fait le code
  var position = 1;
  let LastPosition = 0;
  const searchInput = document.body.querySelector("#q");
  const flecheDroite = document.getElementById("button-right");
  const flecheGauche = document.getElementById("button-left");
  const cont = data.length;
  position = GoToPosition(position, LastPosition);
  flecheDroite.addEventListener("click", Verifsuivant);
  flecheGauche.addEventListener("click", Verifprecedent);
  document.addEventListener("keyup", Verifsuivant);
  document.addEventListener("keyup", Verifprecedent);

  function GoToPosition(position, LastPosition) {
    if (LastPosition > 0) {
      let madiapoDavant = document.body.querySelector(
        `div.message-container div.content-container div.message:nth-child(${LastPosition})`
      );
      madiapoDavant.classList.remove("activeMessage");
      let monpoint = document.body.querySelector(
        `.message-container .position-message div.point:nth-child(${LastPosition})`
      );
      monpoint.classList.toggle("active");
      //console.log("Lastposition = " + LastPosition);
    }
    let madiapo = document.body.querySelector(
      `div.message-container div.content-container div.message:nth-child(${position})`
    );
    let monpoint = document.body.querySelector(
      `.message-container .position-message div.point:nth-child(${position})`
    );
    monpoint.classList.toggle("active");
    madiapo.classList.add("activeMessage");
    // console.log("position = " + position);
    axios({
      method: "post",
      url: "http://localhost:6630/diapoIndex",
      data: {
        postionIndex: position,
      },
    })
      .then(function (response) {
        const datares = response.data
        console.log(datares.title);
      })
      .catch(function (error) {
        console.log(error);
      });
    return position;
  }

  function Verifsuivant(e) {
    if (
      (e.key == "ArrowRight" || e.key == undefined) &&
      document.activeElement !== searchInput
    ) {
      LastPosition = position;
      if (position >= cont) {
        position = 1;
      } else {
        position += 1;
      }
      position = GoToPosition(position, LastPosition);
    }
  }

  function Verifprecedent(e) {
    if (
      (e.key == "ArrowLeft" || e.key == undefined) &&
      document.activeElement !== searchInput
    ) {
      LastPosition = position;
      if (position <= 1) {
        position = cont;
      } else {
        position -= 1;
      }
      position = GoToPosition(position, LastPosition);
    }
  }
}
// Empêcher que la recherche soit envoyée s'il n'y a rien d'écrit dans le champ
document.querySelector("form").addEventListener("submit", (e) => {
  if (document.getElementById("q").value === "") {
    e.preventDefault();
    return;
  }
});
