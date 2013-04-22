iD.floors.Basement = function(context) {
    var floor = {
        button: 'floor-basement',
        id: 'floor-basement',
        title: t('floors.basement.title'),
        description: t('floors.basement.description'),
        key: '⇧b'
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
