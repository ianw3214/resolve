// TODO: (Ian) Move functions into a namespace
// Simple vertex shader for 2D drawing
const vertex = `
    // TODO: (Ian) Add conversion from pixels to normalized float
    attribute vec4 a_pos;
    
    void main() {
        gl_Position = a_pos;
    }`;

const fragment = `   
    // TODO: (Ian) Add uniform to adjust colour
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }`;

// GLOBAL VARIABLES
var gl;
var shader_info;

// Initialize webGL
function init() {
    const canvas = document.querySelector("#glCanvas");
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("Unable to initialize webGL");
        return;
    }

    // TODO: ??
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    shader_program = createShaderProgram(vertex, fragment);

}

// Function to create and link shaders
function createShaderProgram(v_src, f_src) {
    const vertexShader = loadShader(gl.VERTEX_SHADER, v_src);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, f_src);

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
function loadShader(type, src) {
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
function clearBuffer() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// Function to draw a rectangle
function drawRect() {
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Add rectangle data to the buffer
    setBufferRectangle(0.0, 0.0, 0.5, 0.5);
    var positionLocation = gl.getAttribLocation(shader_program, "a_pos");
    gl.useProgram(shader_program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Helper function to fill buffer data with rectangle data
function setBufferRectangle(x, y, width, height) {
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