// >>>CHANGE: the number of rows to add more notes. Youo will also need to changes the 'notes variable to assign a note to it
let rows = 4;         // Number of rows (notes)
let cols = 16;        // Number of columns (steps)
let grid = [];
let currentStep = 0;
let synths = [];
let isPlaying = false;

//>>> CHANGE the notes here. If you add more notes, remember to add a new one to this list!
let notes = ['C4', 'E4', 'G4', 'B4']

// Size of the sequencer (fixed size for the grid)
let sequencerWidth = 800;
let sequencerHeight = 200;
let cellWidth, cellHeight;

// Position of the sequencer within the canvas
let sequencerX;  // X position of sequencer
let sequencerY;  // Y position of sequencer

let playButton;
let tempoSlider;
let tempoValue = 120;  // Initial tempo

// Initialize a synth for each row
function setupSynths() {
  for (let i = 0; i < rows; i++) {
    let synth = new Tone.Synth().toDestination();
    synths.push(synth);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);  // Canvas fills the whole window
  cellWidth = sequencerWidth / cols;        // Width of each cell
  cellHeight = sequencerHeight / rows;      // Height of each cell

  sequencerX = width/2 - sequencerWidth/2  // X position of sequencer
  sequencerY = 100;  // Y position of sequencer

  // Initialize the grid with false (inactive) states
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push(false);
    }
    grid.push(row);
  }

  setupSynths();

  // Create the Play/Stop button inside the canvas
  playButton = createButton('Play');
  playButton.position(width/2 - 150/2, 400);  // Center below sequencer
  playButton.mousePressed(togglePlay);  // Attach the togglePlay function to the button
  playButton.addClass("button");

  // Create the tempo slider inside the canvas
  tempoSlider = createSlider(60, 240, tempoValue);  // Slider with range from 60 to 240 BPM
  tempoSlider.position(sequencerX + sequencerWidth / 2 - 100, sequencerY + sequencerHeight + 60);  // Below the Play button
  tempoSlider.style('width', '200px');  // Make the slider wider
  tempoSlider.addClass("slider");

  // Set up Tone.js loop for sequencer timing
  Tone.Transport.scheduleRepeat(time => {
    playStep(time);
    currentStep = (currentStep + 1) % cols;
  }, "16n"); //>>>CHANGE: the devision 16n, 8n, 4n, etc
  Tone.Transport.swing = 0.4


  
}

function draw() {
  background(240);  // Fill background

  // Draw the sequencer grid at the specified X, Y position
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j]) {
        fill(0);  // Active step
      } else {
        //>>>CHANGE the colour of the step
        fill(255);
      }
      stroke(0);
      rect(sequencerX + j * cellWidth, sequencerY + i * cellHeight, cellWidth, cellHeight);
    }
  }

  // Highlight the current step
  // >>CHANGE: the colour of the timing bar
  fill(20, 255, 100, 100);
  noStroke();
  rect(sequencerX + currentStep * cellWidth, sequencerY, cellWidth, sequencerHeight);

  // Update the tempo based on the slider value
  let newTempo = tempoSlider.value();
  if (newTempo !== tempoValue) {
    Tone.Transport.bpm.value = newTempo;  // Update Tone.js Transport's BPM
    tempoValue = newTempo;
  }
}

// Toggle grid state on mouse press within the sequencer area
function mousePressed() {
  //floor function makes sure that we don't use boundaries outside the specified area
  let col = floor((mouseX - sequencerX) / cellWidth);
  let row = floor((mouseY - sequencerY) / cellHeight);

  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    grid[row][col] = !grid[row][col];  // Toggle step
  }
}

// Play sounds for the current step
function playStep(time) {
  for (let i = 0; i < rows; i++) {
    if (grid[i][currentStep]) {
      let note = notes[i];  // Assign notes to rows
      synths[i].triggerAttackRelease(note, '8n', time);
    }
  }
}

// Toggle the sequencer on/off with the button
function togglePlay() {
  if (isPlaying) {
    Tone.Transport.stop();
    playButton.html('Play');
  } else {
    Tone.Transport.start();
    playButton.html('Stop');
  }
  isPlaying = !isPlaying;
}

// Resize the canvas if the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
