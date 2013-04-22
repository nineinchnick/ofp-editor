iD.floors.Second = function(context) {
    var floor = {
        button: 'floor-second',
        id: 'floor-second',
        title: t('floors.second.title'),
        description: t('floors.second.description'),
        key: '⇧2'
    };

    var behaviors = [];

    floor.enterFloor = function() {
        behaviors.forEach(function(behavior) {
            context.install(behavior);
        });
    };

    floor.exitFloor = function() {
        behaviors.forEach(function(behavior) {
            context.uninstall(behavior);
        });
    };

    return floor;
};
