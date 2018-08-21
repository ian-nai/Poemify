// This code is based off of an example by @shiffman: https://github.com/shiffman/A2Z-F16

// Keep track of all words by pos
var wordbypos = {};
// Keep track of all words
var poslist = [];

function setup() {
  noCanvas();
  // Assign the generate() function to the button
  var generateButton = select('#generate');
  generateButton.mousePressed(generate);

  var clearButton = select('#clear');
  clearButton.mousePressed(clearIt);
}

function clearIt() {
  var markovs = selectAll('.con');
  for (var i = 0; i < markovs.length; i++) {
    markovs[i].remove();
  }
  
	var PoemTextArea = $('#PoemTextArea');
	PoemTextArea.val('');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generate() {

  // Get the input text
  var textinput = select('#text');

  // Create a generator with parameters
  var markov = new MarkovGeneratorWord(2, 50);

  // Split it up into line breaks
  var lines = textinput.value().split('\n');

  // Feed in the lines
  for (var i = 0; i < lines.length; i++) {
    // Trim out any extra white space
    var str = lines[i].trim();
    var txt = str.replace(/[^\w\s]|_/g, "")
         .replace(/\s+/g, " ");

    var pos = RiTa.getPosTags(txt);
    var words = RiTa.tokenize(txt);
    markov.feed(pos);

    for (var i = 0; i < pos.length; i++) {
      var tag = pos[i];
      var word = words[i];
      if (!wordbypos[tag]) {
        wordbypos[tag] = [];
        poslist.push(tag);
      }
      wordbypos[tag].push(word);
    }

  }

  // Show the resulting output
  var generatedPos = markov.generate();

  var posarray = generatedPos.split(/\s+/);
  
  var wordCount = getRandomInt(1, 8);

  var generatedText = '';
  for (var i = 0; i < wordCount; i++) {
    var tag = posarray[i];
    var options = wordbypos[tag];
    generatedText += options.choice() + ' ';
  }

    var x = $('<span></span>').attr('class', 'con');
	
    $('<div></div>').html(generatedText).appendTo(x);
    //$('<div></div>').html('item 2').appendTo(x);
    
    x.appendTo('#form')
    $(x).sortable({
    connectWith: ".con"
}).disableSelection();
    

$("span").sortable({
    connectWith: ".con"
}).disableSelection();

var PoemTextArea = $('#PoemTextArea');
PoemTextArea.val(PoemTextArea.val() + '\n' + generatedText);

}
