iD.floors.Other = function(context) {

    var floor = {
        button: 'floor-other',
        id: 'floor-other',
        value: "0", //TODO: this will be set dynamically when the user activates the 'other' option
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
