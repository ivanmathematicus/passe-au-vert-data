window.onload = function () {


var SIZE_CIRCUIT = 700
var PAD_X = 50
var PAD_Y = 50

var V_MAX = 50
var ACC = 2

var scale_x = function(x) {
    return PAD_X + SIZE_CIRCUIT * x;
}

var scale_y = function(y) {
    return PAD_Y + SIZE_CIRCUIT * y;
}

var canvas = document.getElementById('mon_canvas');
if (!canvas) {
    alert("Impossible de récupérer le canvas");
    return;
}

var context = canvas.getContext('2d');
if (!context) {
    alert("Impossible de récupérer le context du canvas");
    return;
}

// Calls animate 30 times per second.
var Interval = setInterval(animate, 1000 / 30);

var circuit = [{
    'x': scale_x(0),
        'y': scale_y(0)
}, {
    'x': scale_x(0),
        'y': scale_y(1 / 2)
}, {
    'x': scale_x(1),
        'y': scale_y(1 / 2)
}, {
    'x': scale_x(1),
        'y': scale_y(1)
}, {
    'x': scale_x(1),
        'y': scale_y(1)
},{
    'x': scale_x(1 / 2),
        'y': scale_y(1)
}, {
    'x': scale_x(1 / 2),
        'y': scale_y(0)
}, {
    'x': scale_x(0),
        'y': scale_y(0)
}];

var lengthCircuit = function (c) {
    var total_length = 0;
    for (i = 1; i < c.length; i++) {
        total_length += Math.sqrt(Math.pow(c[i].x - c[i - 1].x, 2) + Math.pow(c[i].y - c[i - 1].y, 2));
    }
    return total_length;
};

var preprocessCircuit = function (c) {
    var total_length = lengthCircuit(c);
    c[0].proportion = 0
    for (i = 1; i < c.length; i++) {
        segment_length = Math.sqrt(Math.pow(c[i].x - c[i - 1].x, 2) + Math.pow(c[i].y - c[i - 1].y, 2));
        c[i].proportion = c[i - 1].proportion + segment_length / total_length;
    }
    return c;
}

var is_reachable = function (s_start, v_start, s_target, t_left) {
    // Return if the target is reachable in the alloted time t_left.

    // We start by computing the furthest we could go.
    // We have 2 phases: phase 1 is acceleration, phase 2 is max speed.
    t_acc_max = 2 * (V_MAX - v_start) / ACC;
    s_max_phase_1 = s_start + t_acc_max * v_start + 0.5 * ACC * (t_acc_max ** 2);
    s_max_phase_2 = s_max_phase_1 + Math.max(t_left - t_acc_max, 0) * V_MAX;

    // We compare it to our target.
    if(s_max_phase_2 > s_target) {
    }
}

//Ideally total_length should be a method of a circuit object.
var total_length = lengthCircuit(circuit);

segment_proportions = preprocessCircuit(circuit)
var speed = 1 / total_length;
var direction = 'y';
var s = 0;


var parameterizedPosition = function (s) {
    // Lister les proportions dans le circuit après preprocess
    // Trouver la place de s dans la liste de proportions.
    // Ca donne le i de x_start et x_end (du segment circuit[i])
    var i_segment = circuit.length - 1;
    while(0 < i_segment && s < circuit[i_segment].proportion) {
        i_segment -= 1;
    };

    console.log(i_segment, 'i_segment');
    var x_start = circuit[i_segment].x
    var y_start = circuit[i_segment].y
    var x_end = circuit[i_segment + 1].x
    var y_end = circuit[i_segment + 1].y

    var segment_rel_size = circuit[i_segment + 1].proportion - circuit[i_segment].proportion

    var x = ((circuit[i_segment + 1].proportion - s) / segment_rel_size) * x_start + ((s - circuit[i_segment].proportion) / segment_rel_size) * x_end;
    var y = ((circuit[i_segment + 1].proportion - s) / segment_rel_size) * y_start + ((s - circuit[i_segment].proportion) / segment_rel_size) * y_end;
    return {
        'x': x,
            'y': y,
            'dir_x': x_end - x_start,
            'dir_y': y_end - y_start
    };
};


var drawBicycle = function (s) {
    var coordinates = parameterizedPosition(s);
    var slope_x = (coordinates.dir_x) / (Math.sqrt(Math.pow(coordinates.dir_x, 2) + Math.pow(coordinates.dir_y, 2)))
    var slope_y = (coordinates.dir_y) / (Math.sqrt(Math.pow(coordinates.dir_x, 2) + Math.pow(coordinates.dir_y, 2)))

    center_1_x = coordinates.x - slope_x * 13
    center_1_y = coordinates.y - slope_y * 13
    center_2_x = coordinates.x + slope_x * 13
    center_2_y = coordinates.y + slope_y * 13    

    context.fillStyle = 'red';
    context.strokeStyle = 'black';
    context.beginPath();
    context.moveTo(center_1_x, center_1_y);
    context.lineTo(center_2_x, center_2_y);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.arc(center_1_x, center_1_y, 10, 0, Math.PI * 2);
    context.arc(center_2_x, center_2_y, 10, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.fillStyle = 'black';
};
//*/




function animate() {
    // We clean the canvas.
    context.clearRect(0, 0, canvas.width, canvas.height);

    s += speed;
    s = s % 1;
    drawBicycle(s);
    
    context.beginPath();
    context.strokeStyle = 'black';

    context.moveTo(circuit[0].x, circuit[0].y);
    for (i = 0; i < circuit.length; i++) {
        context.lineTo(circuit[i].x, circuit[i].y);
    }

    context.stroke();
    context.closePath();
}}