let position = 1;
let LastPosition = 0;

export function createContent(data, Firstcontent = "") {
  let messages = Firstcontent;
  let points = "";
  data.forEach((obj) => {
    if (typeof obj.titre === "string" && typeof obj.contenu === "string") {
      messages += `<div class="message"><h2>${obj.titre}</h2>`;
      if (
        obj.img &&
        obj.imgDescript &&
        typeof obj.img === "string" &&
        typeof obj.imgDescript === "string"
      ) {
        messages += `<img src="${obj.img}" alt="${obj.imgDescript}" loading="lazy" height="500">`;
      }
      messages += "<p>" + obj.contenu + "</p></div>";
      points += `<div class='point'></div>`;
    }
  });

  return {messages, points};
}

// trie le tableau de manière aléatoire que j'ai un peu pompé https://www.delftstack.com/fr/howto/javascript/shuffle-array-javascript/#m%C3%A9langer-un-tableau-en-utilisant-l-algorithme-de-m%C3%A9lange-de-fisher-yates
export function melangeTableau(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); //random index
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
}

export function GoToPosition(position, LastPosition) {
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
  return position;
}


function pointEvent(e) {
  LastPosition = position;
  position = Number(e.target.id);
  //console.log(position);
  position = GoToPosition(position, LastPosition);
  return position;
}

export function readyToInteract(count) {
  const flecheDroite = document.getElementById("button-right");
  const flecheGauche = document.getElementById("button-left");
  position = GoToPosition(position, LastPosition);
  flecheDroite.addEventListener("click", (e) => Verifsuivant(e, count));
  flecheGauche.addEventListener("click", (e) =>
    Verifprecedent(e, count)
  );
  document.addEventListener("keyup", (e) => Verifsuivant(e, count));

  document.addEventListener("keyup", (e) => Verifprecedent(e, count));
  let PointIncrement = 0;
  document.querySelectorAll("div.point").forEach((point) => {
    PointIncrement++;
    point.id = PointIncrement;
    point.addEventListener("click", pointEvent);
  });
}



const searchInput = document.body.querySelector("#q");

export function Verifsuivant(e, count) {
  if (
    (e.key == "ArrowRight" || e.key == undefined) &&
    document.activeElement !== searchInput
  ) {
    LastPosition = position;
    if (position >= count) {
      position = 1;
    } else {
      position += 1;
    }
    position = GoToPosition(position, LastPosition);
  }
  return position;
}

export function Verifprecedent(e, count) {
  if (
    (e.key == "ArrowLeft" || e.key == undefined) &&
    document.activeElement !== searchInput
  ) {
    LastPosition = position;
    if (position <= 1) {
      position = count;
    } else {
      position -= 1;
    }
    position = GoToPosition(position, LastPosition);
  }
  return position;
}
