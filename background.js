chrome.runtime.onMessage.addListener(
 function(request, sender, sendResponse) {
  if (request.message == "convert_image_url_to_data_url"){
        var canvas = document.createElement("canvas");
        var img = new Image();
        img.addEventListener("load", function() {
            canvas.getContext("2d").drawImage(img, 0, 0);
            sendResponse({data: canvas.toDataURL()}); 
        });
        img.src = request.url;
        }
    }
)