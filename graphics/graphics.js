var graphics = {};

// TODO: (Ian) Move functions into a namespace
// Simple vertex shader for 2D drawing
const vertex = `
    attribute vec4 a_pos;
    
    uniform float u_screenWidth;
    uniform float u_screenHeight;

    void main() {
        float x = (a_pos.x / u_screenWidth) * 2.0 - 1.0;
        float y = (a_pos.y / u_screenHeight) * 2.0 - 1.0;
        gl_Position = vec4(x, y, 0.0, 1.0);
    }`;

const fragment = `   
    precision mediump float;
    uniform vec4 u_colour;
    void main() {
        gl_FragColor = u_colour;
    }`;

// GLOBAL VARIABLES
var gl;
var shader_info;

// Initialize webGL
graphics.init = function() {
    const canvas = document.querySelector("#glCanvas");
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("Unable to initialize webGL");
        return;
    }

    // TODO: ??
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    shader_program = graphics.createShaderProgram(vertex, fragment);
    gl.useProgram(shader_program);
    gl.uniform1f(gl.getUniformLocation(shader_program, "u_screenWidth"), gl.canvas.clientWidth);
    gl.uniform1f(gl.getUniformLocation(shader_program, "u_screenHeight"), gl.canvas.clientHeight);

}

// Function to create and link shaders
graphics.createShaderProgram = function(v_src, f_src) {
    const vertexShader = graphics.loadShader(gl.VERTEX_SHADER, v_src);
    const fragmentShader = graphics.loadShader(gl.FRAGMENT_SHADER, f_src);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

// Function to create and compile a shader
graphics.loadShader = function(type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling shader: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Function to clear the screen
graphics.clearBuffer = function() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// Function to draw a rectangle
graphics.drawRect = function(x = 0, y = 0, w = 30, h = 30, colour = [1.0, 0.0, 1.0, 1.0]) {

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Add rectangle data to the buffer
    graphics.setBufferRectangle(x, y, w, h);
    var positionLocation = gl.getAttribLocation(shader_program, "a_pos");
    gl.useProgram(shader_program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    // Set the colour
    var colourLocation = gl.getUniformLocation(shader_program, "u_colour");
    gl.uniform4fv(colourLocation, colour);
    // Draw the actual rectangle
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Helper function to fill buffer data with rectangle data
graphics.setBufferRectangle = function(x, y, width, height) {

    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}