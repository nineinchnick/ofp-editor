iD.floors.Other = function(context) {

    var floor = {
        button: 'floor-other',
        id: 'floor-other',
        title: t('floors.other.title'),
        description: t('floors.other.description'),
        key: 'O'
    };

    floor.set = function(name, key) {
        floor.title = name;
        floor.key = key;
        return floor;
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
