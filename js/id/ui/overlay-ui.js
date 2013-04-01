/**
 * Overlay UI panel
 * panel was based on the help panel
 * fields are based on presets.js
 * (trying to avoid modifying source project files for now to make merging easier while iD is being heavily developed
 *  we might want to revisit using TagEditor directly after it quiets down)
 * @param context
 * @return {Function}
 * @constructor
 */
iD.ui.Overlay = function(context) {

	var key = 'i',
        formwrap,
        formbuttonwrap,
        fields = [],
        shown = false,
        tags = {
            opacity: 65,
            xPos: 0,
            yPos: 0,
            width: 0,
            height: 0,
            xOffset: 0,
            yOffset: 0,
            rotation: 0
        };

	function overlay(selection) {

		var pane, content;

        function change(event) {
          console.info("change:" + event);
        }

        function close(event) {
            console.info("close:" + event);
        }

        function createField(id, label, placeholder) {
            var field = {};
            field.type = 'number';
            field.id = 'overlay-' + id;
            field.key = id;
            field.placeholder = placeholder;
            field.label = function () {
                return label;
            };

            field.reference = iD.ui.TagReference(null, {key: field.key});
            field.shown = function() { return true; };
            field.input = iD.ui.preset[field.type](field)
                .on('close', close)
                .on('change', change);


            fields.push(field);
        }

		function setup() {
			pane = context.container()
				.select('.overlay-wrap')
				.html('');


			content = pane.append('div')
					.attr('class', 'left-content');
			content.append('h2')
					.text(t('overlay.title'));
			content.append('div')
					.attr('class', 'body');
			content.append('input')
					.attr('type', 'file')
					.attr('id', 'files')
					.attr('name', 'files[]');
					//attr('multiple', '');
			content.append('output')
					.attr('id', 'create-overlay-image')
					.classed('overlay-create-image', true);


            createField('opacity', 'Opacity', '');
            createField('width', 'Width', '');
            createField('height', 'Height', '');
            createField('rotation', 'Rotation', '');
            createField('xPos', 'X Position', '');
            createField('yPos', 'Y Position', '');
            createField('xOffset', 'X Offset', '');
            createField('yOffset', 'Y Offset', '');

			document.getElementById('files').addEventListener('change', handleFileSelect, false);
		}

        function fieldKey(field) {
            return field.id;
        }

        function fieldsShown() {
            return fields.filter(function(field) { return field.shown(); });
        }

        function fieldsNotShown() {
            return fields.filter(function(field) { return !field.shown(); });
        }

        function show(field) {
            field.show = true;
            renderFields();
            field.input.focus();
        }

        function revert(field) {
            d3.event.stopPropagation();
            d3.event.preventDefault();
            var t = {};
            field.keys.forEach(function(key) {
                t[key] = original ? original.tags[key] : undefined;
            });
            event.change(t);
        }

        function toggleReference(field) {
            d3.event.stopPropagation();
            d3.event.preventDefault();

            _.forEach(fieldsShown(), function(other) {
                if (other.id === field.id) {
                    other.reference.toggle();
                } else {
                    other.reference.hide();
                }
            });

            renderFields();
        }



        function renderFields() {
            if (!formwrap) { return; }

            var selection = formwrap.selectAll('.form-field')
                .data(fieldsShown(), fieldKey);

            var enter = selection.enter()
                .insert('div', '.more-buttons')
                .style('opacity', 0)
                .attr('class', function(field) {
                    return 'form-field form-field-' + field.id + ' fillL col12';
                });

            enter.transition()
                .style('max-height', '0px')
                .style('padding-top', '0px')
                .style('opacity', '0')
                .transition()
                .duration(200)
                .style('padding-top', '20px')
                .style('max-height', '240px')
                .style('opacity', '1');

            var label = enter.append('label')
                .attr('class', 'form-label')
                .attr('for', function(field) { return 'preset-input-' + field.id; })
                .text(function(field) { return field.label(); });

            label.append('button')
                .attr('class', 'tag-reference-button minor')
                .attr('tabindex', -1)
                .on('click', toggleReference)
                .append('span')
                .attr('class', 'icon inspect');

            label.append('button')
                .attr('class', 'modified-icon minor')
                .attr('tabindex', -1)
                .on('click', revert)
                .append('div')
                .attr('class','icon undo');

            enter.each(function(field) {
                d3.select(this)
                    .call(field.input)
                    .call(field.reference);

                //tell the overlay layer to update when this field changes
                context.map().layers[3].setEvent(field.input);
            });

            selection
                .each(function(field) {
                    field.input.tags(tags);
                });


            selection.exit()
                .remove();

            var addFields = formbuttonwrap.selectAll('.preset-add-field')
                .data(fieldsNotShown(), fieldKey);

            addFields.enter()
                .append('button')
                .attr('class', 'preset-add-field')
                .on('click', show)
                .call(bootstrap.tooltip()
                    .placement('top')
                    .title(function(d) { return d.label(); }))
                .append('span')
                .attr('class', function(d) { return 'icon ' + d.icon; });

            addFields.exit()
                .transition()
                .style('opacity', 0)
                .remove();



            return selection;
        }


        function imageLoaded(width, height, xPos, yPos) {
            tags.width = width;
            tags.height = height;
            tags.xPos = xPos;
            tags.yPos = yPos;

            renderFields();
        }


		function handleFileSelect(evt) {
			var files = evt.target.files; // FileList object

			// Loop through the FileList and render image files as thumbnails.
			var f = files[0];

            // Only process image files.
            if (!f.type.match('image.*')) {
                alert("Not an image file!");
                return;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {


                    //set the image data on the context
                    context.overlay = e.target.result;

                    //set the callback to get initial image attributes
                    context.map().layers[3].setImageLoadedCallback(imageLoaded);

                    //fire the event to tell the overlay background layer
                    var event = document.createEvent("UIEvents");
                    event.initEvent("load-overlay",true,true);
                    d3.select('body')[0][0].dispatchEvent(event);


                    formwrap = content.append('div').html('');

                    formbuttonwrap = formwrap.append('div')
                        .attr('class', 'col12 more-buttons inspector-inner');

                    renderFields();

                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);

        }



		function hide() { setVisible(false); }
		function toggle() {
			if (d3.event) d3.event.preventDefault();
			tooltip.hide(button);
			setVisible(!button.classed('active'));
		}

		function blockClick() {
			pane.on('mousedown.overlay-inside', function() {
				return d3.event.stopPropagation();
			});
			selection.on('mousedown.overlay-inside', function() {
				return d3.event.stopPropagation();
			});
		}

		function setVisible(show) {
			if (show !== shown) {
				button.classed('active', show);
				shown = show;
				if (show) {
					pane.style('display', 'block')
						.style('left', '-500px')
						.transition()
						.duration(200)
						.style('left', '0px')
						.each('end', blockClick);
				} else {
					pane.style('left', '0px')
						.transition()
						.duration(200)
						.style('left', '-500px')
						.each('end', function() {
							d3.select(this).style('display', 'none');
						});
					pane.on('mousedown.overlay-inside', null);
				}
			}
		}

		var tooltip = bootstrap.tooltip()
			.placement('right')
			.html(true)
			.title(iD.ui.tooltipHtml(t('overlay.title'), key));

		var button = selection.append('button')
			.attr('tabindex', -1)
			.on('click', toggle)
			.call(tooltip);

		button.append('span')
			.attr('class', 'icon overlay light');

		context.surface().on('mousedown.overlay-outside', hide);
		context.container().on('mousedown.b.overlay-outside', hide);

		setup();

		var keybinding = d3.keybinding('overlay');
		keybinding.on(key, toggle);
		d3.select(document).call(keybinding);
	}

	return overlay;
};
