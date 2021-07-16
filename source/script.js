/* global fieldProperties, setAnswer, goToNextField, getPluginParameter, getMetaData, setMetaData */

var choices = fieldProperties.CHOICES
var appearance = fieldProperties.APPEARANCE
var fieldType = fieldProperties.FIELDTYPE
var numChoices = choices.length

if ((fieldProperties.READONLY)) { // So "read only" does nothing
  function setAnswer () {}
}

var labelContainer = document.querySelector('#label')
var hintContainer = document.querySelector('#hint')

var choiceContainers // Will eventually contain all choice containers, either from no appearance, or 'list-nolabel' appearance
var radioButtonsContainer = document.querySelector('#radio-buttons-container') // default radio buttons
var selectDropDownContainer = document.querySelector('#select-dropdown-container') // minimal appearance
var likertContainer = document.querySelector('#likert-container') // likert
var choiceLabelContainer = document.querySelector('#choice-labels')
var listNoLabelContainer = document.querySelector('#list-nolabel')

var selectedValue // This stores the currently selected value until it is ready to be set as the field answer

var metadata = getMetaData()
if (metadata == null) {
  metadata = ''
}

var otherValue = getPluginParameter('other')
if (otherValue == null) {
  var lastChoiceValue = choices[numChoices - 1].CHOICE_VALUE
  otherValue = lastChoiceValue
}
otherValue = String(otherValue)

var requireOther = getPluginParameter('require')
requireOther === 0 ? requireOther = false : requireOther = true

var labelOrLnl

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

if (!labelOrLnl) {
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
var otherInput = document.createElement('input')
otherInput.setAttribute('type', 'text')
otherInput.setAttribute('value', metadata)
otherInput.setAttribute('id', 'other-input')
otherInput.setAttribute('placeholder', 'Enter other response here' + (requireOther ? '' : ' (optional)') + '...')
otherInput.setAttribute('dir', 'auto')
otherInput.classList.add('response', 'default-answer-text-size')
otherContainer.appendChild(otherInput)

// Prepare the current webview, making adjustments for any appearance options
if ((appearance.indexOf('minimal') !== -1) && (fieldType === 'select_one')) { // minimal appearance
  removeContainer('minimal')
  selectDropDownContainer.style.display = 'block' // show the select dropdown
  selectDropDownContainer.parentElement.insertBefore(otherContainer, selectDropDownContainer.nextSibling)
} else if (appearance.indexOf('list-nolabel') !== -1) { // list-nolabel appearance
  removeContainer('nolabel')
  labelContainer.parentElement.removeChild(labelContainer)
  hintContainer.parentElement.removeChild(hintContainer)
  listNoLabelContainer.parentElement.insertBefore(otherContainer, listNoLabelContainer.nextSibling)
} else if (labelOrLnl) { // If 'label' appearance
  removeContainer('label')
  labelContainer.parentElement.removeChild(labelContainer)
  hintContainer.parentElement.removeChild(hintContainer)
  choiceLabelContainer.parentElement.insertBefore(otherContainer, choiceLabelContainer.nextSibling)
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
  likertContainer.parentElement.insertBefore(otherContainer, likertContainer.nextSibling)
} else { // all other appearances
  removeContainer('radio')
  if (fieldProperties.LANGUAGE !== null && isRTL(fieldProperties.LANGUAGE)) {
    radioButtonsContainer.dir = 'rtl'
  }

  for (var i = 0; i < numChoices; i++) {
    var choice = choices[i]
    console.log('Looking for:', otherValue)
    console.log(choice.CHOICE_VALUE)
    if (choice.CHOICE_VALUE === otherValue) {
      console.log(choice.CHOICE_VALUE)
      console.log(choiceContainers[i + 1])
      radioButtonsContainer.insertBefore(otherContainer, choiceContainers[i].nextSibling)
      break
    } else if (i + 1 === numChoices) {
      console.log('Adding to end')
      radioButtonsContainer.appendChild(otherContainer)
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
    }
  }
  for (var i = 0; i < numButtons; i++) {
    buttons[i].onchange = function () {
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

getSelectedChoices()
otherSelected()

otherInput.oninput = function () {
  var inputValue = otherInput.value
  setMetaData(inputValue)
  if (requireOther) {
    if ((inputValue.length > 0)) {
      setAnswer(selectedValue)
    } else {
      setAnswer('')
    }
  }
}

function clearAnswer () {
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

// Removed the containers that are not to be used
function removeContainer (keep) {
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

function getSelectedChoices () {
  var selected = []
  for (var c = 0; c < numChoices; c++) {
    if (choiceContainers[c].querySelector('INPUT').checked === true) {
      selected.push(choices[c].CHOICE_VALUE)
    }
  }
  selectedValue = selected.join(' ')
}

function otherSelected () {
  if (selectedValue.split(' ').indexOf(otherValue) !== -1) {
    otherContainer.style.display = 'inline'
    otherInput.focus()
    metadata = getMetaData()
    if (requireOther && ((metadata == null) || (metadata === ''))) {
      setAnswer('')
    } else {
      setAnswer(selectedValue)
    }
    return true
  } else {
    return false
  }
}

// Save the user's response (update the current answer)
function change () {
  console.log('Changing')
  if (fieldType === 'select_one') {
    selectedValue = this.value
    if (!otherSelected()) {
      otherContainer.style.display = 'none'
      setAnswer(this.value)
      // If the appearance is 'quick', then also progress to the next field
      if (appearance.indexOf('quick') !== -1) {
        goToNextField()
      }
    }
  } else {
    getSelectedChoices()
    if (!otherSelected()) {
      otherContainer.style.display = 'none'
      setAnswer(selectedValue)
    }
  }
}

// If the field label or hint contain any HTML that isn't in the form definition, then the < and > characters will have been replaced by their HTML character entities, and the HTML won't render. We need to turn those HTML entities back to actual < and > characters so that the HTML renders properly. This will allow you to render HTML from field references in your field label or hint.
function unEntity (str) {
  return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

// Detect right-to-left languages
function isRTL (s) {
  var ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' + '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF'
  var rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC'
  var rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']')

  return rtlDirCheck.test(s)
}
