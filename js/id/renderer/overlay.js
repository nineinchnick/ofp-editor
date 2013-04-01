iD.Overlay = function(context) {
    var imageData,
        projection,
        rotation = 0,
        z,
        image,
        transformStart,
        transformProp = iD.util.prefixCSSProperty('Transform'),
        imageLoadedCallback,
        size = [0, 0],
        imageSizeMult = 0.5; //screen dimension multiplier of initial image size


    function tileSizeAtZoom(z0, z) {
        var xSizeAtZoom = Math.ceil(size[0] * Math.pow(2, z - z0)) / size[0],
            ySizeAtZoom = Math.ceil(size[1] * Math.pow(2, z - z0)) / size[1];
        return [xSizeAtZoom, ySizeAtZoom];
    }


    // Update tiles based on current state of `projection`.
    function overlay(selection) {

        z = Math.max(Math.log(projection.scale()) / Math.log(2) - 8, 0);

        render(selection);
    }

    function imageTransform() {

        var ascale = projection.scale();
        var bscale = transformStart[0];
        var scale = (ascale / bscale);


        var tX = Math.round((projection.translate()[0] / scale) - (transformStart[1][0]));
        var tY = Math.round((projection.translate()[1] / scale) - (transformStart[1][1]));
        //var tX = Math.round((projection.translate()[0] / scale) - (transformStart[1][0])) - ((image[0][0].offsetWidth) * scale);
        // var tY = Math.round((projection.translate()[1] / scale) - (transformStart[1][1])) - ((image[0][0].offsetHeight) * scale);
        //var tX = Math.round((projection.translate()[0] / scale) - (transformStart[1][0])) - ((image[0][0].offsetWidth/2) * scale);
        //var tY = Math.round((projection.translate()[1] / scale) - (transformStart[1][1])) - ((image[0][0].offsetHeight/2) * scale);

        var transform =
            'scale(' + scale + ')' +
                'rotate(' + rotation + 'deg)' +
                'translate(' + tX + 'px,' + tY + 'px) ';

        return transform;
    }

    function render(selection) {
        if (!imageData) {return; } //don't do anything if we don't have an active overlay

        function load() {
            d3.select(this)
                .on('load', null)
                .classed('tile-loaded', true);
            render(selection);
        }




        //image = selection.select('#overlay-image-tile');


        if (!image) {


            //TODO: size and position the image in the center of the screen
            //handle a range of image sizes

            //center of current map in
             var center = context.map().center();
            var projCenter = projection.center();
             var dim = context.map().size();
            var centerX = dim[0] / 2;
            var centerY = dim[1] / 2;
            var imageWidth = dim[0] * imageSizeMult;
            var imageHeight =dim[1] * imageSizeMult;
            var imagePosX = centerX - (imageWidth / 2);
            var imagePosY = centerY - (imageHeight / 2);
            //var projectedCenter = projection([centerX, centerY]);

            var trans0 = projection.translate();
            projection.center([center[0], center[1]]); // temporarily set center
            projection.translate([imagePosX, imagePosY]);
            var trans1 = projection.translate();
            projection.translate(projection([0, 0])); // compute appropriate translate*/
            var trans2 = projection.translate();
            projection.center([0, 0]); // reset
            var trans3 = projection.translate();
            /*projection.translate([imagePosWidth * projection.scale(), imagePosHeight * projection.scale()])
                .translate(projection([0, 0]));*/

           /* var transform =
                'scale(' + 1 + ')' +
                    'translate(' + imagePosWidth + 'px,' + imagePosHeight + 'px) ';
*/

            transformStart = [
                projection.scale(),
                projection.translate()];


            projection.translate(trans0);
            var trans7 = projection.translate();

            //attach the image to the DOM
            image = selection.append('img')
                .attr('id', 'overlay-image-tile')
                .attr('src', context.overlay)
                .attr('title', 'overlay image')
                .attr('width', imageWidth)
                .attr('height', imageHeight)
                .style(transformProp, imageTransform())
                .style('opacity', '0.65');

            //give the UI panel the initial settings
            imageLoadedCallback(imageWidth, imageHeight, imagePosX, imagePosY);

            //record the initial transformation so we can pan/zoom the image relative to the map
            /*transformStart = [
                projection.scale(),
                projection.translate().slice()];*/




        } else {
           // size[0] = image[0][0].width;
           // size[1] = image[0][0].height;
            image.style(transformProp, imageTransform());
        }

        //image.style(transformProp, imageTransform());
    }

    /**
     * Get change events from the overlay ui panel
     * @param event
     */
    function change(event) {
        if (event.opacity) {
            image.style('opacity', event.opacity / 100);
        } else if (event.width) {
            image.attr('width', event.width);
        } else if (event.height) {
            image.attr('height', event.width);
        } else if (event.rotation) {
            rotation = event.rotation;
            image.style(transformProp, imageTransform());
        }
    }

    overlay.id = 'layer-overlay';

	overlay.offset = function(_) {
        if (!arguments.length) {return offset; }
        offset = _;
        return overlay;
    };

	overlay.nudge = function(_, zoomlevel) {
        offset[0] += _[0] / Math.pow(2, zoomlevel);
        offset[1] += _[1] / Math.pow(2, zoomlevel);
        return overlay;
    };

    overlay.projection = function(_) {
        if (!arguments.length) {return projection; }
        projection = _;
        return overlay;
    };

	overlay.size = function(_) {
        if (!arguments.length) {return size; }
        size = _;
        return overlay;
    };


	overlay.setImageData = function(_) {
        if (!arguments.length) {return imageData; }

        //create new tile
        imageData = _;

        //redraw the map (will also call render() on this layer)
        context.redraw();
        return overlay;
    };


    overlay.setEvent = function(input) {
        input.on('change', change);
    };

    overlay.setImageLoadedCallback = function(callback) {
        imageLoadedCallback = callback;
    };

    d3.select('body')
        .on('load-overlay', function() {
            overlay.setImageData(context.overlay);
        });

    return overlay;
};
