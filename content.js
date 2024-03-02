let scrollHeight = 0;
const scrollStep = 100; // Pixels to scroll each step
const scrollInterval = 1000; // Milliseconds between scrolls

function scrollToBottom() {
  if (scrollHeight < document.body.scrollHeight) {
    window.scrollTo(0, scrollHeight);
    scrollHeight += scrollStep;
    setTimeout(scrollToBottom, scrollInterval);
    chrome.runtime.sendMessage({action: "captureScreenshot"});
  } else {
    window.scrollTo(0, 0); // Reset scroll to top
    alert('Reached bottom of page, capturing complete.');
    // Signal background script that scrolling is complete
    chrome.runtime.sendMessage({action: "scrollComplete"});
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  debugger
  if (request.action === "startCapture") {
    scrollToBottom();
  }
});
