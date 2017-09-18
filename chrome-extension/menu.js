function requestLink() {
  console.log("menu button clicked");
  chrome.tabs.query({currentWindow: true, active: true }, function (tabs) {
    var message = {"message": "provide shareable URL"};
      chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": "highlightr.io"});

var child1 = chrome.contextMenus.create({"title": "Copy Shareable Link", "parentId": parent, "onclick": requestLink});
// var child2 = chrome.contextMenus.create(
//   {"title": "Test", "parentId": parent, "onclick": genericOnClick});
