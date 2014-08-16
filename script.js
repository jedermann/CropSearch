
console.log("execute");
$('img').click(function() {

    var image=this;
    console.log("Höhe " + this.height);
    console.log("Breite " + this.width);
    console.log("Position - x " + this.x);
    console.log("Position - y " + this.y);

    var canv = document.createElement('canvas');
    canv.id = 'cropImage';
    document.body.appendChild(canv); // adds the canvas to the body element
    canv.width = this.width;
    canv.height = this.height;
    $(canv).css('z-index', 9999);
    $(canv).css('position', 'absolute');
    $(canv).css('top', this.y);
    $(canv).css('left', this.x);

    var ctx = canv.getContext('2d');
    var cropRect = new Selection(canv.width / 2, canv.height / 2, canv.width / 10, canv.height / 10);
    var cropButton=new CropButton(ctx, "Crop");
    cropRect.draw(ctx);
    cropButton.draw(ctx);



    $('#cropImage').mousemove(function(e) { // binding mouse move event
        var canvasOffset = $(canv).offset();
        iMouseX = Math.floor(e.pageX - canvasOffset.left);
        iMouseY = Math.floor(e.pageY - canvasOffset.top);

        // in case of drag of whole selector
        if (cropRect.bDragAll) {
            cropRect.x = iMouseX - cropRect.px;
            cropRect.y = iMouseY - cropRect.py;
        }

        for (i = 0; i < 4; i++) {
            cropRect.bHow[i] = false;
            cropRect.iCSize[i] = cropRect.csize;
        }

        // hovering over resize cubes
        if (iMouseX > cropRect.x - cropRect.csizeh && iMouseX < cropRect.x + cropRect.csizeh &&
            iMouseY > cropRect.y - cropRect.csizeh && iMouseY < cropRect.y + cropRect.csizeh) {

            cropRect.bHow[0] = true;
            cropRect.iCSize[0] = cropRect.csizeh;
        }
        if (iMouseX > cropRect.x + cropRect.w - cropRect.csizeh && iMouseX < cropRect.x + cropRect.w + cropRect.csizeh &&
            iMouseY > cropRect.y - cropRect.csizeh && iMouseY < cropRect.y + cropRect.csizeh) {

            cropRect.bHow[1] = true;
            cropRect.iCSize[1] = cropRect.csizeh;
        }
        if (iMouseX > cropRect.x + cropRect.w - cropRect.csizeh && iMouseX < cropRect.x + cropRect.w + cropRect.csizeh &&
            iMouseY > cropRect.y + cropRect.h - cropRect.csizeh && iMouseY < cropRect.y + cropRect.h + cropRect.csizeh) {

            cropRect.bHow[2] = true;
            cropRect.iCSize[2] = cropRect.csizeh;
        }
        if (iMouseX > cropRect.x - cropRect.csizeh && iMouseX < cropRect.x + cropRect.csizeh &&
            iMouseY > cropRect.y + cropRect.h - cropRect.csizeh && iMouseY < cropRect.y + cropRect.h + cropRect.csizeh) {

            cropRect.bHow[3] = true;
            cropRect.iCSize[3] = cropRect.csizeh;
        }

        // in case of dragging of resize cubes
        var iFW, iFH;
        if (cropRect.bDrag[0]) {
            var iFX = iMouseX - cropRect.px;
            var iFY = iMouseY - cropRect.py;
            iFW = cropRect.w + cropRect.x - iFX;
            iFH = cropRect.h + cropRect.y - iFY;
        }
        if (cropRect.bDrag[1]) {
            var iFX = cropRect.x;
            var iFY = iMouseY - cropRect.py;
            iFW = iMouseX - cropRect.px - iFX;
            iFH = cropRect.h + cropRect.y - iFY;
        }
        if (cropRect.bDrag[2]) {
            var iFX = cropRect.x;
            var iFY = cropRect.y;
            iFW = iMouseX - cropRect.px - iFX;
            iFH = iMouseY - cropRect.py - iFY;
        }
        if (cropRect.bDrag[3]) {
            var iFX = iMouseX - cropRect.px;
            var iFY = cropRect.y;
            iFW = cropRect.w + cropRect.x - iFX;
            iFH = iMouseY - cropRect.py - iFY;
        }

        if (iFW > cropRect.csizeh * 2 && iFH > cropRect.csizeh * 2) {
            cropRect.w = iFW;
            cropRect.h = iFH;

            cropRect.x = iFX;
            cropRect.y = iFY;
        }
        drawScene(ctx, cropRect, cropButton);
    });

    $('#cropImage').mousedown(function(e) { // binding mousedown event
        var canvasOffset = $(canv).offset();
        iMouseX = Math.floor(e.pageX - canvasOffset.left);
        iMouseY = Math.floor(e.pageY - canvasOffset.top);

        cropRect.px = iMouseX - cropRect.x;
        cropRect.py = iMouseY - cropRect.y;

        if (cropRect.bHow[0]) {
            cropRect.px = iMouseX - cropRect.x;
            cropRect.py = iMouseY - cropRect.y;
        }
        if (cropRect.bHow[1]) {
            cropRect.px = iMouseX - cropRect.x - cropRect.w;
            cropRect.py = iMouseY - cropRect.y;
        }
        if (cropRect.bHow[2]) {
            cropRect.px = iMouseX - cropRect.x - cropRect.w;
            cropRect.py = iMouseY - cropRect.y - cropRect.h;
        }
        if (cropRect.bHow[3]) {
            cropRect.px = iMouseX - cropRect.x;
            cropRect.py = iMouseY - cropRect.y - cropRect.h;
        }

        if (iMouseX > cropRect.x + cropRect.csizeh && iMouseX < cropRect.x + cropRect.w - cropRect.csizeh &&
            iMouseY > cropRect.y + cropRect.csizeh && iMouseY < cropRect.y + cropRect.h - cropRect.csizeh) {

            cropRect.bDragAll = true;
        }

        if (iMouseX > cropButton.x && iMouseX < cropButton.x + cropButton.width &&
            iMouseY > cropButton.y && iMouseY < cropButton.y + cropButton.height) {

            console.log("Button Press");
            cropImage(image, cropRect);
        }


        for (i = 0; i < 4; i++) {
            if (cropRect.bHow[i]) {
                cropRect.bDrag[i] = true;
            }
        }
    });

    $('#cropImage').mouseup(function(e) { // binding mouseup event
        cropRect.bDragAll = false;

        for (i = 0; i < 4; i++) {
            cropRect.bDrag[i] = false;
        }
        cropRect.px = 0;
        cropRect.py = 0;
    });

});

function Selection(x, y, w, h) {
    this.x = x; // initial positions
    this.y = y;
    this.w = w; // and size
    this.h = h;

    this.px = x; // extra variables to dragging calculations
    this.py = y;

    this.csize = 3; // resize cubes size
    this.csizeh = 6; // resize cubes size (on hover)

    this.bHow = [false, false, false, false]; // hover statuses
    this.iCSize = [this.csize, this.csize, this.csize, this.csize]; // resize cubes sizes
    this.bDrag = [false, false, false, false]; // drag statuses
    this.bDragAll = false; // drag whole selection
}

// define Selection draw method
Selection.prototype.draw = function(ctx) {

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.fillStyle='#000';
    ctx.save();
    ctx.globalAlpha=.4;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.restore();


    /*  // draw part of original image
    if (this.w > 0 && this.h > 0) {
        ctx.drawImage(image, this.x, this.y, this.w, this.h, this.x, this.y, this.w, this.h);
    }*/

    // draw resize cubes
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
    ctx.fillRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
    ctx.fillRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
    ctx.fillRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);
}


function drawScene(ctx, cropRect,cropButton) { // main drawScene function
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear canvas

    // draw selection
    cropRect.draw(ctx);
    cropButton.draw(ctx);
}

function CropButton(ctx,label){
    this.height=20;
    this.width=50;
    this.x=ctx.canvas.width-this.width;
    this.y=ctx.canvas.height-this.height;
    this.label=label;

}

CropButton.prototype.draw = function(ctx) {
    ctx.font = "10pt sans-serif";
    ctx.fillStyle = "black";
    ctx.globalAlpha=.5;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.globalAlpha=1;
    ctx.fillStyle = "white";
    ctx.fillText(this.label, this.x+12, this.y+15 );
}



function cropImage(image, cropRect) {
    var temp_ctx, temp_canvas;
    temp_canvas = document.createElement('canvas');
    temp_ctx = temp_canvas.getContext('2d');
    temp_canvas.width = cropRect.w;
    temp_canvas.height = cropRect.h;
    console.log(image);
    temp_ctx.drawImage(image, cropRect.x, cropRect.y, cropRect.w, cropRect.h, 0, 0, cropRect.w, cropRect.h);
    var vData = temp_canvas.toDataURL("image/png");
    $('image').attr('src', vData);
    
}


//@success is the callback
function local_url_to_data_url(url,success){    
  chrome.runtime.sendMessage({message: "convert_image_url_to_data_url",url:url}, 
           function(response) {success(response.data)}
    );  
}