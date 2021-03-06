// Chris Koenig <ckoenig@seas.upenn.edu>

// http://stackoverflow.com/questions/2967332/jquery-plugin-for-event-driven-architecture
function EventBus() { }

EventBus.prototype.subscribe = function (event_string, fn) {
    $(this).bind(event_string, fn);
};

EventBus.prototype.publish = function (event_string, data) {
    $(this).trigger(event_string, data);
}
