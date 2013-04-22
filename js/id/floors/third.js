iD.floors.Third = function(context) {
    var floor = {
        button: 'floor-third',
        id: 'floor-third',
        title: t('floors.third.title'),
        description: t('floors.third.description'),
        key: '⇧3'
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
