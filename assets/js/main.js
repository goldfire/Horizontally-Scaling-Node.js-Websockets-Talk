// DOM Reference.
var clickArea = document.querySelector('.click-area');
var introText = document.querySelector('.intro-text');
var audioContext = (typeof AudioContext !== 'undefined') ? new AudioContext() : new webkitAudioContext();

var ws = new Primus('ws://localhost:8000/primus');
ws.on('data', function(data) {
  playAudioVisual(data.x, data.y, 'blue');
});

// Handle all clicks on the click area.
clickArea.addEventListener('click', function onClick(event) {
  unlockMobile();

  // Send the location to the server.
  ws.write({
    x: event.x,
    y: event.y
  });

  // Hide the intro text.
  introText.className = 'intro-text hide';
}, false);

/**
 * Display the clicked/touched spot and play the associated tone.
 * @param  {Number} x     The x-coordinate clicked.
 * @param  {Number} y     The y-cooridnate clicked.
 * @param  {String} color Color to rende the dot.
 */
function playAudioVisual(x, y, color) {
  // Adjust the location by the radius of the circle.
  x -= 25;
  y -= 25;

  // Setup the base DOM element.
  var div = document.createElement('div');
  div.className = 'color-dot show ' + color;
  div.style.left = x + 'px';
  div.style.top = y + 'px';
  clickArea.appendChild(div);

  // Play the tone based on its location relative to the screen.
  var sounds = [280, 320, 350, 370, 400, 440, 470, 520, 540, 560, 590, 610, 640];
  synth.pitch(sounds[Math.round((x / window.innerWidth) * sounds.length)]);
  synth.start();

  // Fade out the circle.
  setTimeout(function() {
    synth.stop();
    div.className = 'color-dot hide ' + color;
  }, 2000);

  // Remove the circle from the DOM.
  setTimeout(function() {
    clickArea.removeChild(div);
  }, 3000);
}

/**
 * Unlock Web Audio on mobile devices.
 */
function unlockMobile() {
  if (!unlocked) {
    var source = audioContext.createBufferSource();
    source.buffer = audioContext.createBuffer(1, 1, 22050);
    source.connect(audioContext.destination);
    source.start(0);
    source.onended = function() {
      unlocked = true;
      source.disconnect(0);
    };
  }
}

// Setup submono so that we can play a range of tones.
var synth = new Monosynth(audioContext);
var unlocked = false;