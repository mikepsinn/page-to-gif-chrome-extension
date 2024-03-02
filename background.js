chrome.action.onClicked.addListener((tab) => {
  // Send a message to the content script in the active tab
  chrome.tabs.sendMessage(tab.id, {action: "startCapture"});
});


let screenshots = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "captureScreenshot") {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(dataUrl) {
      // Add the screenshot data URL to the array
      screenshots.push(dataUrl);

      // Optionally, send a response back to the content script
      sendResponse({status: "Screenshot captured"});
    });
    return true; // Indicates that the response is asynchronous
  } else if (request.action === "scrollComplete") {
    // Handle the completion of scrolling and screenshot capture
    chrome.storage.local.set({"screenshots": screenshots}, function() {
      console.log('Screenshots saved to storage.');
      // Now, you might open a popup or send a message to it to start GIF creation
    });
    // Reset the screenshots array for the next use
    screenshots = [];
  }
});
