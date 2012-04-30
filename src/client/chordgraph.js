// Chris Koenig <ckoenig@seas.upenn.edu>
// CIS-553 Extra Credit, Spring 2012

function ChordGraph(event_bus, svg_id) {
    this.event_bus = event_bus;
    this.svg_id = svg_id;  // The SVG selector text, like "#chord-graph".

    // Grab the SVG element, based on the given element id:
    this.svg = d3.select("#" + this.svg_id);
    if (this.svg.empty()) throw new Error("No element " + this.svg_id);

    this.draw_chord_network();

    _.bindAll(this, "handle_join");
    this.event_bus.subscribe("localhost:joined", this.handle_join);
}

ChordGraph.prototype.get_circle_pos = function () {
    var svg_width = $("#" + this.svg_id).width(),
        svg_height = $("#" + this.svg_id).height();

    return {
        "cx": (svg_width / 2),
        "cy": (svg_height / 2),
        "r": 100
    };
};

ChordGraph.prototype.draw_chord_network = function () {
    // Calculate the position of the Chord circle:
    var circle_pos = this.get_circle_pos();

    // Draw the circle in the backdrop:
    this.svg.append("g")
      .append("circle")
        .attr("cx", circle_pos.cx)
        .attr("cy", circle_pos.cy)
        .attr("r", circle_pos.r)
        .attr("stroke", "black")
        .attr("stroke-width", 4)
        .attr("fill", "none");
};

ChordGraph.prototype.handle_join = function (e, data) {
    console.log("ChordGraph processing join!");
    console.log(data);

    this.draw_node(data.key, "localhost");
    if (data.successor != data.key)
        this.draw_node(data.successor, "successor");

    // TODO Draw range
};

ChordGraph.prototype.draw_node = function (key, type) {
    var angle = this.get_key_angle(key);
    var circle_pos = this.get_circle_pos();

    var new_circle_x = circle_pos.cx + Math.sin(angle) * circle_pos.r;
    var new_circle_y = circle_pos.cy + Math.cos(angle) * circle_pos.r;

    var node = this.svg.append("g")
      .append("circle")
        .attr("id", key)
        .attr("cx", new_circle_x)
        .attr("cy", new_circle_y)
        .attr("stroke", "black")
        .attr("stroke-width", 4);

    var radius = (type == "localhost") ? 5 : 2;
    var fill = (type == "localhost") ? "white" : "black";

    node.attr("r", radius)
        .attr("fill", fill);
};

ChordGraph.prototype.get_key_angle = function (key) {
    // Use the first six hex digits to approximate the angle:
    var value = parseInt(key.slice(0, 6), 16),
        max = parseInt("FFFFFF", 16);

    return (2 * Math.PI * (value / max));  // Radians.
};
