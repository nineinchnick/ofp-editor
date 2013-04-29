iD.floors.First = function(context) {
    var floor = {
        button: 'floor-first',
        id: 'floor-first',
        value: "1",
        title: t('floors.first.title'),
        description: t('floors.first.description'),
        key: '⇧1'
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
