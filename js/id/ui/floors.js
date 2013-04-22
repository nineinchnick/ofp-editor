iD.ui.Floors = function(context) {
    var floors = [
        iD.floors.Basement(context),
        iD.floors.First(context),
        iD.floors.Second(context),
        iD.floors.Third(context),
        iD.floors.Other(context)];

    return function(selection, limiter) {
        var buttons, notice;
        buttons = selection.selectAll('button.floor-button')
            .data(floors);

        buttons.enter().append('button')
            .attr('tabindex', -1)
            .attr('class', function(floor) { return floor.id + ' floor-button col-floor'; })
            .on('click.floor-buttons', function(floor) {
                if (floor.id === context.floor().id) {
                    context.enterFloor(iD.floors.First(context));
                } else {
                    context.enterFloor(floor);
                }
            })
            .call(bootstrap.tooltip()
                .placement('bottom')
                .html(true)
                .title(function(floor) {
                    return iD.ui.tooltipHtml(floor.description, floor.key);
                }));

        notice = iD.ui.notice(limiter)
            .message(false)
            .on('zoom', function() { context.map().zoom(16); });

        function disableTooHigh() {
            if (context.map().editable()) {
                notice.message(false);
                buttons.attr('disabled', null);
            } else {
                buttons.attr('disabled', 'disabled');
                notice.message(true);
                context.enterFloor(iD.floors.First(context));
            }
        }

        context.map()
            .on('move.floor-buttons', _.debounce(disableTooHigh, 500));

        //buttons.append('span')
        //    .attr('class', function(floor) { return floor.id + ' icon icon-pre-text'; });

        buttons.append('span')
            .attr('class', 'label')
            .text(function(floor) { return floor.title; });

        context.on('enterFloor.editor', function(entered) {
            buttons.classed('active', function(floor) { return entered.button === floor.button; });
            context.container()
                .classed("floor-" + entered.id, true);
        });

        context.on('exitFloor.editor', function(exited) {
            context.container()
                .classed("floor-" + exited.id, false);
        });

        var keybinding = d3.keybinding('floor-buttons');

        floors.forEach(function(f) {
            keybinding.on(f.key, function() { if (context.map().editable()) context.enterFloor(f); });
        });

        d3.select(document)
            .call(keybinding);
    };

};
