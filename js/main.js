var gsection = section();

function game() {
  d3.select("#container")
    .append("div")
      .attr("id", "board")
      .datum(data)
      .call(gsection);
}

function section() {
  function idx(d) {
    return d.id;
  }

  function chart(selection, data) {
    var section = selection.selectAll('ul')
        .data(data, idx);

    section.enter().append('ul').
         attr("class", "section").
         each(activateDraggingForSection).
         each(function(d, i) {
           d3.select(this).
              html(d.name);
         });

    var cards = section.selectAll("li")
        .data(function(d) { return d.cards; }, idx);

    cards.enter().append("li").
                  attr("draggable", "true").
                  each(activateDraggingForCard).
                  each(function(d, i) {
                    d3.select(this).
                       html(d.name);

                    if(d.owner) {
                      d3.select(this).append("img").
                         attr('draggable', false).
                         attr("src", d.owner).
                         attr("class", "icon");
                    }
                  });

    cards.exit().remove();
  }

  var my = function(selection) {
    selection.each(function(data) {
      return chart(d3.select(this), data);   
    });
  };

  return my;
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
  var card = d3.select(this).style('opacity', '0.4'),
      section = d3.select(this.parentNode);

  e.dataTransfer.effectAllowed = 'move';

  e.dataTransfer.setData('section-id', section.datum().id.toString());
  e.dataTransfer.setData('card-id', card.datum().id.toString());
}

function handleDragEnd(e) {
  d3.select(this).style('opacity', '1.0');

  d3.selectAll(".section")
      .each(function() {
        d3.select(this).classed('over', false);
      });
}

function handleDrop(e) {
  var section = d3.select(this);

  if (e.preventDefault) {
    e.preventDefault();
  }

  if (e.stopPropagation) {
    e.stopPropagation();
  }

  var toSectionId = section.datum().id.toString();
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

  d3.select('#board').call(gsection);
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
