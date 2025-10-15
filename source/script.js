/* global fieldProperties, setAnswer, goToNextField, getPluginParameter, getMetaData, setMetaData */

var choices = fieldProperties.CHOICES
var appearance = fieldProperties.APPEARANCE
var fieldType = fieldProperties.FIELDTYPE
var numChoices = choices.length

if (fieldProperties.READONLY) { // So "read only" does nothing when setting answer
  var setAnswer = function () { }
}

var labelContainer = document.querySelector('#label')
var hintContainer = document.querySelector('#hint')

var choiceContainers // Will eventually contain all choice containers, either from no appearance, or 'list-nolabel' appearance
var radioButtonsContainer = document.querySelector('#radio-buttons-container') // default radio buttons
var selectDropDownContainer = document.querySelector('#select-dropdown-container') // minimal appearance
var likertContainer = document.querySelector('#likert-container') // likert
var choiceLabelContainer = document.querySelector('#choice-labels')
var listNoLabelContainer = document.querySelector('#list-nolabel')

var metadata = getMetaData() // Metadata combines the previously selected choices with the "other" value. That way, if the enumerator leaves before the answer is actually set, the field will be populated with what they had previously entered.
var selectedChoices // Array of the values of the currently selected choices. Will store them until they are ready to be applied to setAnswer()
var inputValue // Current text in the "other" text box
if (metadata == null) {
  metadata = ''
  selectedChoices = []
  inputValue = ''
} else {
  [selectedChoices, inputValue] = metadata.split('|') // This is in case the enumerator left the field before entering text into the text box, so the answer wasn't saved
  selectedChoices = selectedChoices.split(' ')
}

var otherValue = getPluginParameter('other') // Get choice value that is used as "other", so know where to put the box, and when selected this choice is selected, the box will appear.
if (otherValue == null) {
  var lastChoiceValue = choices[numChoices - 1].CHOICE_VALUE // Use last choice if none given
  otherValue = lastChoiceValue
}
otherValue = String(otherValue) // Make string, since choice values are stored as strings

var requireOther = getPluginParameter('required')
requireOther === 0 ? requireOther = false : requireOther = true // If "requireOther" is true, then the "other" text box needs data if the "other" choice is selected

var placeholderText = getPluginParameter('placeholder') // Get custom placeholder text for the "other" text box

var labelOrLnl // Whether it is "label" or "list-nolabel" appearance
if (appearance.indexOf('label') === -1) {
  labelOrLnl = false
} else {
  labelOrLnl = true
}

if (labelOrLnl) {
  choiceContainers = document.querySelectorAll('.fl-radio') // Go through all  the available choices if 'list-nolabel'
} else {
  choiceContainers = document.querySelectorAll('.choice-container') // go through all the available choices
}

if (!labelOrLnl) { // There is a different box for these, so not for "label" or "list-nolabel"
  if (fieldProperties.LABEL) {
    labelContainer.innerHTML = unEntity(fieldProperties.LABEL)
  }
  if (fieldProperties.HINT) {
    hintContainer.innerHTML = unEntity(fieldProperties.HINT)
  }
}

// Creating the "Other" container that will be added
var otherContainer = document.createElement('div')
otherContainer.setAttribute('id', 'other-container')
otherContainer.style.display = 'none'
var otherInput = document.createElement('textarea')
otherInput.setAttribute('type', 'text')
otherInput.setAttribute('id', 'other-input')

// Set placeholder text
if (placeholderText !== undefined) {
  if (placeholderText === '') {
    // Empty string means no placeholder
    otherInput.placeholder = ''
  } else {
    // Use custom placeholder text, adding "(optional)" if not required
    otherInput.placeholder = placeholderText + (requireOther ? '' : ' (optional)')
  }
} else {
  // Use default behavior
  if (fieldProperties.QUESTION_PLACEHOLDER_LABEL) {
    otherInput.placeholder = fieldProperties.QUESTION_PLACEHOLDER_LABEL + (requireOther ? '' : ' (optional)')
  } else {
    otherInput.placeholder = 'Enter other response here' + (requireOther ? '' : ' (optional)') + '...'
  }
}

otherInput.setAttribute('dir', 'auto')
otherInput.setAttribute('autocomplete', 'off')
otherInput.appendChild(document.createTextNode(inputValue))
otherInput.classList.add('response', 'default-answer-text-size')
otherContainer.appendChild(otherInput)

// Prepare the current webview, making adjustments for any appearance options
if ((appearance.indexOf('minimal') !== -1) && (fieldType === 'select_one')) { // minimal appearance
  removeContainer('minimal')
  selectDropDownContainer.style.display = 'block' // show the select dropdown
  selectDropDownContainer.parentElement.insertBefore(otherContainer, selectDropDownContainer.nextSibling) // Add other box
} else if (appearance.indexOf('list-nolabel') !== -1) { // list-nolabel appearance
  removeContainer('nolabel')
  labelContainer.parentElement.removeChild(labelContainer)
  hintContainer.parentElement.removeChild(hintContainer)
  listNoLabelContainer.parentElement.insertBefore(otherContainer, listNoLabelContainer.nextSibling) // Add other box
} else if (labelOrLnl) { // If 'label' appearance
  removeContainer('label')
  labelContainer.parentElement.removeChild(labelContainer)
  hintContainer.parentElement.removeChild(hintContainer)
  choiceLabelContainer.parentElement.insertBefore(otherContainer, choiceLabelContainer.nextSibling) // Add other box
} else if ((appearance.indexOf('likert') !== -1) && (fieldType === 'select_one')) { // likert appearance
  removeContainer('likert')
  likertContainer.style.display = 'flex' // show the likert container
  // likert-min appearance
  if (appearance.indexOf('likert-min') !== -1) {
    var likertChoices = document.querySelectorAll('.likert-choice-container')
    for (var i = 1; i < likertChoices.length - 1; i++) {
      likertChoices[i].querySelector('.likert-choice-label').style.display = 'none' // hide all choice labels except the first and last
    }
    likertChoices[0].querySelector('.likert-choice-label').classList.add('likert-min-choice-label-first') // apply a special class to the first choice label
    likertChoices[likertChoices.length - 1].querySelector('.likert-choice-label').classList.add('likert-min-choice-label-last') // apply a special class to the last choice label
    otherInput.style.marginTop = '30px'
  }
  likertContainer.parentElement.insertBefore(otherContainer, likertContainer.nextSibling) // Add other box
} else { // all other appearances
  removeContainer('radio')
  if (fieldProperties.LANGUAGE !== null && isRTL(fieldProperties.LANGUAGE)) {
    radioButtonsContainer.dir = 'rtl'
  }

  // ADDING "OTHER" BOX
  // Cycle through to add the "Other" box below the correct choice
  for (var i = 0; i < numChoices; i++) {
    var choice = choices[i]
    var choiceValue = choice.CHOICE_VALUE

    if (choiceValue === otherValue) { // When finds the choice specified for the other choice, adds the container below that
      radioButtonsContainer.insertBefore(otherContainer, choiceContainers[i].nextSibling) // Add other box
      break
    }
  }

  // quick appearance
  if ((appearance.indexOf('quick') !== -1) && (fieldType === 'select_one')) {
    for (var i = 0; i < numChoices; i++) {
      choiceContainers[i].classList.add('appearance-quick') // add the 'appearance-quick' class

      if (choices[i].CHOICE_VALUE !== otherValue) { // Don't add icon to "Other" choice
        choiceContainers[i].querySelectorAll('.choice-label-text')[0].insertAdjacentHTML('beforeend', '<svg class="quick-appearance-icon"><use xlink:href="#quick-appearance-icon" /></svg>') // insert the 'quick' icon
      }
    }
  }
}

// START RESIZING TOOLS

var hiddenDiv = document.querySelector('.hidden-text')
var hiddenText = hiddenDiv.querySelector('p')

hiddenDiv.style.width = otherInput.offsetWidth + 'px'

otherInput.addEventListener('input', resizeTextBox)
window.onload = resizeTextBox

// END RESIZING TOOLS

// minimal appearance
if ((appearance.indexOf('minimal') !== -1) && (fieldType === 'select_one')) {
  selectDropDownContainer.onchange = change // when the select dropdown is changed, call the change() function (which will update the current value)
} else if ((appearance.indexOf('likert') !== -1) && (fieldType === 'select_one')) { // likert appearance
  var likertButtons = document.querySelectorAll('div[name="opt"]')
  for (var i = 0; i < likertButtons.length; i++) {
    likertButtons[i].onclick = function () {
      // clear previously selected option (if any)
      var selectedOption = document.querySelector('.likert-input-button.selected')
      if (selectedOption) {
        selectedOption.classList.remove('selected')
      }
      this.classList.add('selected') // mark clicked option as selected
      change.apply({ value: this.getAttribute('data-value') }) // call the change() function and tell it which value was selected
    }
  }
} else { // all other appearances
  var buttons = document.querySelectorAll('input[name="opt"]')
  var numButtons = buttons.length

  if (fieldType === 'select_one') { // Change to radio buttons if select_one
    for (var i = 0; i < numButtons; i++) {
      buttons[i].type = 'radio'
      var choiceValue = choices[i].CHOICE_VALUE
      if (selectedChoices.indexOf(choiceValue) !== -1) {
        buttons[i].checked = true
      } else {
        buttons[i].checked = false
      }
    }
  }
  for (var i = 0; i < numButtons; i++) {
    var choiceValue = choices[i].CHOICE_VALUE
    if (selectedChoices.indexOf(choiceValue) !== -1) { // Selects choice in display if choice is already selected (for returning to field)
      buttons[i].checked = true
    } else {
      buttons[i].checked = false
    }

    buttons[i].onchange = function () { // Detector for when choice is selected
      // remove 'selected' class from a previously selected option (if any)
      var selectedOption = document.querySelector('.choice-container.selected')
      if ((selectedOption) && (fieldType === 'select_one')) {
        selectedOption.classList.remove('selected')
      }
      this.parentElement.classList.add('selected') // add 'selected' class to the new selected option
      change.apply(this) // call the change() function and tell it which value was selected
    }
  }
}

getSelectedChoices() // Get selected choices and store in "selectedChoices" for later use
otherSelected() // Show text box if "Other" choice selected

// Detects whene text is entered into the "Other" box
otherInput.oninput = function () {
  inputValue = otherInput.value
  setMetaData(selectedChoices + '|' + inputValue) // Saves metadata so if the enumerator leaves when the box is blank, then the selected choices are still selected
  if (requireOther) { // Only set answer if not required, or text is in box
    if ((inputValue.length > 0)) {
      setAnswer(selectedChoices)
      otherInput.classList.remove('blinking')
    } else {
      setAnswer('')
      otherInput.classList.add('blinking')
    }
  }
}

function resizeTextBox() {
  hiddenDiv.style.display = 'block'
  hiddenDiv.style.width = otherInput.offsetWidth + 'px' // In case the window is reshaped
  hiddenText.innerHTML = otherInput.value.replaceAll('\n', '<br>&8203;') // The &8203; is a zero-width space, so that there is content on a blank line. This is so a blank line with nothing after it actually takes effect
  var newHeight = hiddenDiv.offsetHeight
  hiddenDiv.style.display = 'none'
  otherInput.style.height = newHeight + 'px'
}

function clearAnswer() {
  // minimal appearance
  if (appearance.indexOf('minimal') !== -1) {
    selectDropDownContainer.value = ''
  } else if (appearance.indexOf('likert') !== -1) { // likert appearance
    var selectedOption = document.querySelector('.likert-input-button.selected')
    if (selectedOption) {
      selectedOption.classList.remove('selected')
    }
  } else { // all other appearances
    for (var b = 0; b < numButtons; b++) {
      var selectedOption = buttons[b]
      selectedOption.checked = false
      selectedOption.parentElement.classList.remove('selected')
    }
  }
  setAnswer('')
}

// Remove the containers that are not to be used
function removeContainer(keep) {
  if (keep !== 'radio') {
    radioButtonsContainer.parentElement.removeChild(radioButtonsContainer) // remove the default radio buttons
  }

  if (keep !== 'minimal') {
    selectDropDownContainer.parentElement.removeChild(selectDropDownContainer) // remove the select dropdown contrainer
  }

  if (keep !== 'likert') {
    likertContainer.parentElement.removeChild(likertContainer) // remove the likert container
  }

  if (keep !== 'label') {
    choiceLabelContainer.parentElement.removeChild(choiceLabelContainer)
  }

  if (keep !== 'nolabel') {
    listNoLabelContainer.parentElement.removeChild(listNoLabelContainer)
  }
}

// Gather selected choices, saving them in "selectedChoices", which will be used in setAnswer() when ready.
function getSelectedChoices() {
  var selected = []
  for (var c = 0; c < numChoices; c++) {
    if (choiceContainers[c].querySelector('INPUT').checked === true) {
      selected.push(choices[c].CHOICE_VALUE)
    }
  }
  selectedChoices = selected.join(' ')
}

// Check the currently selected choices, and if "Other" choice is selected, displays the box, and will set answer if text box either not required or has data
function otherSelected() {
  if (selectedChoices.split(' ').indexOf(otherValue) !== -1) {
    otherContainer.style.display = 'inline'
    otherInput.focus() // Go right to box when selected
    metadata = getMetaData()
    if (requireOther && (inputValue === '')) {
      setAnswer('')
      otherInput.classList.add('blinking')
    } else {
      setAnswer(selectedChoices)
      otherInput.classList.remove('blinking')
    }
    return true
  } else {
    return false
  }
}

// Save the user's response (update the current answer)
function change() {
  if (fieldType === 'select_one') {
    selectedChoices = String(this.value)
    if (!otherSelected()) { // If "Other" choice selected, then there are different circumstances for setting answer
      otherContainer.style.display = 'none'
      setAnswer(this.value)
      // If the appearance is 'quick', then also progress to the next field
      if (appearance.indexOf('quick') !== -1) {
        goToNextField()
      }
    }
  } else {
    getSelectedChoices()
    if (!otherSelected()) { // Hide "Other" box if "Other" choice not selected
      otherContainer.style.display = 'none'
      setAnswer(selectedChoices)
    }
  }
  setMetaData(selectedChoices + '|' + inputValue) // Save data in metadata in case answer not yet set.
}

// If the field label or hint contain any HTML that isn't in the form definition, then the < and > characters will have been replaced by their HTML character entities, and the HTML won't render. We need to turn those HTML entities back to actual < and > characters so that the HTML renders properly. This will allow you to render HTML from field references in your field label or hint.
function unEntity(str) {
  return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

// Detect right-to-left languages
function isRTL(s) {
  var ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' + '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF'
  var rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC'
  var rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']')

  return rtlDirCheck.test(s)
}

String.prototype.replaceAll = function (searchFor, replaceWith) {
  var original = this
  while (original.includes(searchFor)) {
    original = original.replace(searchFor, replaceWith)
  }

  return original
}
