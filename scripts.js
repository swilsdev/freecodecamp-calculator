window.onload = function() {
  jsCalc.init();
}

var jsCalc = (function() {
  // funcs
  var addButton, init, resetDisplay, solve, updateCalcText, updateDisplayText;
  // vars
  var buttonDiv, calcDiv, displayDiv, entry, entryState, stack;
  // enums
  var KeyMap, State;

  // links buttons, labels, number values
  // TODO: probably a far simpler way to do this
  KeyMap = { ZERO: 0, ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5, SIX: 6,
    SEVEN: 7, EIGHT: 8, NINE: 9, DEC: 10, PLUS: 11, MINUS: 12, MULT: 13,
    DIV: 14, CLEAR: 15, SOLVE: 16,
    properties: {
      0: { label: 0 },
      1: { label: 1 },
      2: { label: 2 },
      3: { label: 3 },
      4: { label: 4 },
      5: { label: 5 },
      6: { label: 6 },
      7: { label: 7 },
      8: { label: 8 },
      9: { label: 9 },
      10: { label: '.' },
      11: { label: '+' },
      12: { label: '-' },
      13: { label: '*' },
      14: { label: '/' },
      15: { label: 'C' },
      16: { label: '=' }
    }
  };

  State = {
    // waiting for more numerical input or operator
    INPUT: 0,
    // operator was input, waiting for numerical input
    NEXT_INPUT: 1,
    // equation was solved, numerical input will reset calc and start over
    SOLVED: 2
  };

  init = function() {
    buttonDiv = document.getElementById('button-area');
    calcDiv = document.getElementById('calculation-text');
    displayDiv = document.getElementById('display-text');
    entry = '';
    entryState = State.INPUT;
    stack = [];

    resetDisplay();

    var spacing = 85;
    addButton(spacing * 3, spacing * -1, 'CLEAR');
    addButton(spacing * 1, spacing * 3, 'ZERO');
    addButton(spacing * 0, spacing * 0, 'ONE');
    addButton(spacing * 1, spacing * 0, 'TWO');
    addButton(spacing * 2, spacing * 0, 'THREE');
    addButton(spacing * 2, spacing * 3, 'PLUS');
    addButton(spacing * 3, spacing * 2, 'MINUS');
    addButton(spacing * 0, spacing * 1, 'FOUR');
    addButton(spacing * 1, spacing * 1, 'FIVE');
    addButton(spacing * 2, spacing * 1, 'SIX');
    addButton(spacing * 0, spacing * 2, 'SEVEN');
    addButton(spacing * 1, spacing * 2, 'EIGHT');
    addButton(spacing * 2, spacing * 2, 'NINE');
    addButton(spacing * 3, spacing * 0, 'MULT');
    addButton(spacing * 3, spacing * 1, 'DIV');
    addButton(spacing * 0, spacing * 3, 'DEC');
    addButton(spacing * 3, spacing * 3, 'SOLVE');
  }

  addButton = function(x, y, keyName) {
    var newButton = document.createElement('div');
    newButton.id = keyName;
    newButton.className = 'sButton';
    newButton.innerHTML = KeyMap.properties[KeyMap[keyName]].label;
    newButton.onclick = jsCalc.bClick;
    buttonDiv.appendChild(newButton);

    var buttonStyle = document.getElementById(newButton.id).style;
    buttonStyle.top = y + 'px';
    buttonStyle.left = x + 'px';
  }

  // button handler and state logic
  // TODO: clean up logic to something simpler
  bClick = function(buttonClick) {
    var buttonId = buttonClick.srcElement.id;
    var buttonIndex = KeyMap[buttonId];
    var buttonLabel = KeyMap.properties[KeyMap[buttonId]].label

    // if entered number 0-9 OR decimal .
    if (buttonIndex >= 0 && buttonIndex <= 10) {
      if (entryState == State.NEXT_INPUT) {
        entry = '';
        entryState = State.INPUT;
      } else if (entryState == State.SOLVED) {
        resetDisplay();
      }
      entry += buttonLabel;
      updateDisplayText();
    }
    // if entered operator, CLEAR, or SOLVE
    else if (buttonId == 'CLEAR') {
      resetDisplay();
    } else if (buttonId == 'SOLVE') {
      // get last input
      if (entry.length > 0) {
        stack.push(entry);
        updateCalcText();
      }
      var solution = solve();
      stack.push('=');
      stack.push(solution);
      updateCalcText();
      entry = solution;
      updateDisplayText();
      entryState = State.SOLVED;
    } else {
      // must be operator, check to see if there is a number entry to apply op on
      if (entry.length > 0) {
        // push the number entry
        stack.push(entry);
        // push the operator
        stack.push(buttonLabel);
        updateCalcText();
        entryState = State.NEXT_INPUT;
        if(stack.length > 2) {
          entry = solve();
          updateDisplayText();
        }
      }
      // different operator was selected, remove last operator on stack and replace
      else {
        stack.pop();
        stack.push(buttonLabel);
        updateCalcText();
      }
    }
  }

  resetDisplay = function() {
    entry = '';
    entryState = State.INPUT;
    stack = [];
    updateDisplayText();
    updateCalcText();
  }


  solve = function() {
    var total = stack[0];

    // solves equations in sequential order negating operator precedence
    // only solves complete part of stack (4 * 2 +) is solved as (4 * 2)
    for(var i = 2; i < stack.length; i += 2) {
        var str = total + stack[i-1] + stack[i];
        total = eval(str);
    }
    return total;
  }

  updateDisplayText = function() {
    if (entry != '') {
      displayDiv.innerHTML = entry;
    } else {
      displayDiv.innerHTML = '0';
    }
  }

  updateCalcText = function() {
    if (stack.length != 0) {
      var str = '';
      for (var i = 0; i < stack.length; i++) {
        str += stack[i];
        str += ' ';
      }
      calcDiv.innerHTML = str;
    } else {
      calcDiv.innerHTML = '';
    }
  }

  return {
    init: init,
    bClick: bClick
  };
})();
