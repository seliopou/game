function game() {
  d3.select("#container")
    .append("div")
      .attr("id", "board");

  update(data);
}


function update(data) {
  function idx(d) {
    return d.id;
  }

  var sections = d3.select('#board')
    .selectAll("ul")
      .data(data, idx);

  sections.enter().append("ul").
                   attr("class", "enter").
                   attr("class", "section").
                   each(activateDraggingForSection).
                   each(function(d, i) {
                     d3.select(this).
                        html(d.name).
                        attr("data-section-id", d.id);
                   });

  var cards = sections.selectAll("li")
    .data(function(d) { return d.cards; }, idx);

  cards.enter().append("li").
                attr("class", "enter").
                attr("draggable", "true").
                each(activateDraggingForCard).
                each(function(d, i) {
                  d3.select(this).
                     html(d.name).
                     attr("data-card-id", d.id);

                  if(d.owner) {
                    d3.select(this).append("img").
                       attr("src", d.owner).
                       attr("class", "icon");
                  }
                });

  cards.exit().remove();
}

function activateDraggingForSection() {
  this.addEventListener('dragenter', handleDragEnter, false);
  this.addEventListener('dragover', handleDragOver, false);
  this.addEventListener('dragleave', handleDragLeave, false);
  this.addEventListener('drop', handleDrop, false);
}

function activateDraggingForCard() {
  this.addEventListener('dragstart', handleDragStart, false);
  this.addEventListener('dragend', handleDragEnd, false);
}

function handleDragStart(e) {
  this.style.opacity = '0.4';

  e.dataTransfer.effectAllowed = 'move';

  e.dataTransfer.setData('section-id', this.parentNode.getAttribute('data-section-id'));
  e.dataTransfer.setData('card-id', this.getAttribute('data-card-id'));
}

function handleDragEnd(e) {
  this.style.opacity = '1.0';

  var sections = document.querySelectorAll(".section");

  [].forEach.call(sections, function (section) {
    section.classList.remove('over');
  });
}

function handleDrop(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  if (e.stopPropagation) {
    e.stopPropagation();
  }

  var toSectionId = this.getAttribute('data-section-id');
  var fromSectionId = e.dataTransfer.getData('section-id');
  var cardId = e.dataTransfer.getData('card-id');

  moveCard(fromSectionId, toSectionId, cardId);

  return false;
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  e.dataTransfer.dropEffect = 'move';

  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

function moveCard(fromSectionId, toSectionId, cardId) {
  var card;

  for(var i = 0; i < data.length; i++) {
    if(data[i].id.toString() === fromSectionId) {
      for(var j = 0; j < data[i].cards.length; j++) {
        if(data[i].cards[j].id.toString() === cardId) {
          card = data[i].cards[j];
          data[i].cards.splice(j, 1);
        }
      }
    }
  }

  for(var k = 0; k < data.length; k++) {
    if(data[k].id.toString() === toSectionId) {
      data[k].cards.push(card);
    }
  }

  update(data);
}

// Demo.

var data = [
  {
    "id": 1,
    "cards": [
      { "id": 1, "name": "Omar Little", "owner": "" }
    ]
  },
  {
    "id": 2,
    "cards": [
      { "id": 2, "name": "Calvin 'Cheese' Wagstaff", "owner": "images/bunk.jpg" },
      { "id": 3, "name": "Russell 'Stringer' Bell", "owner": "images/mcnulty.jpg" },
      { "id": 4, "name": "Savino Bratton", "owner": "images/kima.jpg" }
    ]
  },
  {
    "id": 3,
    "cards": [
      { "id": 5, "name": "Avon Barksdale", "owner": "images/kima.jpg" },
      { "id": 6, "name": "D'Angelo 'Dee' Barksdale", "owner": "images/mcnulty.jpg" },
      { "id": 7, "name": "Roland 'Wee-Bey' Brice", "owner": "images/kima.jpg" },
      { "id": 8, "name": "Proposition Joe", "owner": "images/bunk.jpg" }
    ]
  }
];

game();
