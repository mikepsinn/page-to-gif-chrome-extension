document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('startCaptureBtn').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "startCapture"});
    });
  });

  document.getElementById('compileGif').addEventListener('click', function () {
    chrome.storage.local.get(["screenshots"], function (result) {
      if (result.screenshots && result.screenshots.length > 0) {
        let gif = new GIF({
          workers: 2,
          quality: 10
        });

        result.screenshots.forEach(function (dataUrl) {
          let img = new Image();
          img.src = dataUrl;
          img.onload = function () {
            gif.addFrame(img, {delay: 200}); // Adjust delay as needed
            if (gif.frames.length === result.screenshots.length) {
              gif.on('finished', function (blob) {
                let url = URL.createObjectURL(blob);
                document.getElementById('outputGif').src = url;
                document.getElementById('outputGif').style.display = 'block';
              });
              gif.render();
            }
          };
        });
      } else {
        console.log('No screenshots found.');
      }
    });
  });
})