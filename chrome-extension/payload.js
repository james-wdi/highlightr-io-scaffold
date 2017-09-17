const state = {
  mode: "POST", // after POSTing once, switch to PATCH
  slug: null, // set on first response
  isActive: false // turn true on message from background.js
}

function highlight (selection) {
  const anchor = selection.anchorNode;
  const focus = selection.focusNode;
  const rangeCount = selection.rangeCount;
  if (rangeCount > 1) throw new Error('More than 1 range! more code necessary!');
  const range = selection.getRangeAt(0);  // is a forEach necessary?
  const slctn = range.extractContents();
  const span = document.createElement('span');
  span.appendChild(slctn);
  span.className = 'highlightr-span';  // branded class name
  span.setAttribute('style', 'background-color: rgba(142, 253, 178, 0.6)!important');
  range.insertNode(span);
}

/* TODO: vanillaJS solution
function ajaxPost (data) {
  const request = new XMLHttpRequest();
  request.open('POST', apiUrl, true);
  //request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  console.log('about to POST', typeof data.content);
  //data.content = String(data.content);
  console.log(data);
  request.send(data);
}
*/

function selectionHandler (e) {
  const selection = window.getSelection();
  if (selection.toString().length === 0) {
    return;
  }
  //chrome.runtime.sendMessage('Selection made');
  highlight(selection);
  // now clear selection
  selection.removeAllRanges();
  //chrome.runtime.sendMessage();
  const data = {
    content: document.all[0].outerHTML,
    _user: null,  // later set this from session
    url: document.location.href
  }
  let endpoint = 'http://localhost:8080/api/articles';
  if (state.mode === 'PATCH') {
    endpoint = `${endpoint}/${state.slug}`;
  }
  $.ajax({
    method: state.mode,
    url: endpoint,
    data: data,
    success: (res) => {
      state.mode = 'PATCH'; // don't POST next time
      state.slug = res.slug;
      alert('Your highlightr link is: ' + res.shareable);
    }
  });
  //ajaxPost(data);
}

function turnOn () {
  state.isActive = true;
  // for css selectors
  document.querySelector('body').classList.add('highlightr-body');
  document.addEventListener('mouseup', selectionHandler);
  console.log("highlighter turn on");
}

function turnOff () {
  state.isActive = false;
  // for css selectors
  document.querySelector('body').classList.remove('highlightr-body');
  document.removeEventListener('mouseup', selectionHandler);
  console.log("highlighter turn off");
}

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  //confirm message recieved.
  console.log("message recieved from eventPage", msg.message);
  if (msg.message === 'highlightr_isActive_true') {
    turnOn();
  }
  if (msg.message === 'highlightr_isActive_false') {
    turnOff();
  }
});
