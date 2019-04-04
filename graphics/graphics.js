var graphics = {};
// TODO: Maybe cache vertex buffers and stuff for optimization

// Simple vertex shader for 2D drawing
const vertex = `
    attribute vec4 a_pos;
    attribute vec2 a_tex;
    
    uniform vec2 u_position;

    uniform float u_screenWidth;
    uniform float u_screenHeight;

    varying vec2 v_texCoord;

    void main() {
        float x = (a_pos.x / u_screenWidth) * 2.0 - 1.0;
        float y = -((a_pos.y / u_screenHeight) * 2.0 - 1.0);
        gl_Position = vec4(x, y, 0.0, 1.0);

        v_texCoord = a_tex;
    }`;

const fragment = `   
    precision mediump float;
    uniform vec4 u_colour;
    void main() {
        gl_FragColor = u_colour;
    }`;

const texture = `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_texCoord;
    void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
    }`;

// GLOBAL VARIABLES
var gl;
var texture_cache = {};

// SHADERS
var shader_program;
var texture_shader;

// CONSTANTS
const full_rect = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,]);
const error_color = [1.0, 0.0, 1.0, 1.0];

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
    texture_shader = graphics.createShaderProgram(vertex, texture);
    gl.useProgram(texture_shader);
    gl.uniform1f(gl.getUniformLocation(texture_shader, "u_screenWidth"), gl.canvas.clientWidth);
    gl.uniform1f(gl.getUniformLocation(texture_shader, "u_screenHeight"), gl.canvas.clientHeight);

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
graphics.drawRect = function(x = 0, y = 0, w = 30, h = 30, colour = error_color) {

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

// Function to draw an image
graphics.drawImage = function (tex, x = 0, y = 0, w = 30, h = 30) {

    if (tex !== null && tex.loaded) {
        gl.bindTexture(gl.TEXTURE_2D, tex.texture);
        gl.useProgram(texture_shader);

        var positionLocation = gl.getAttribLocation(texture_shader, "a_pos");
        var texCoordLocation = gl.getAttribLocation(texture_shader, "a_tex");

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        graphics.setBufferRectangle(x, y, w, h);
        var texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, full_rect, gl.DYNAMIC_DRAW);

        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        // Draw the actual rectangle
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else {
        graphics.drawRect(x, y, w, h, error_color);
    }
}

// Function to draw an image
graphics.drawImageSource = function (tex, source = null, x = 0, y = 0, w = 30, h = 30) {

    if (tex !== null && tex.loaded) {
        gl.bindTexture(gl.TEXTURE_2D, tex.texture);
        gl.useProgram(texture_shader);

        var positionLocation = gl.getAttribLocation(texture_shader, "a_pos");
        var texCoordLocation = gl.getAttribLocation(texture_shader, "a_tex");

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        graphics.setBufferRectangle(x, y, w, h);
        var texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        if (source === null) {
            gl.bufferData(gl.ARRAY_BUFFER, full_rect, gl.DYNAMIC_DRAW);
        } else {
            graphics.setBufferRectangle(
                source.target.x / source.w,
                source.target.y / source.h,
                source.target.w / source.w,
                source.target.h / source.h);
        }

        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        // Draw the actual rectangle
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else {
        graphics.drawRect(x, y, w, h, error_color);
    }
}

// creates a texture info { width: w, height: h, texture: tex }
graphics.loadImage = function (path) {
    if (!!texture_cache[path]) {
        return texture_cache[path];
    }
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    // let's assume all images are not a power of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    var textureInfo = {
        width: 1,   // we don't know the size until it loads
        height: 1,
        loaded: false,
        texture: tex,
    };
    var image = new Image();
    image.src = path;
    image.onload = function() {
        textureInfo.width = image.width;
        textureInfo.height = image.height;

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        textureInfo.loaded = true;
    }
    image.onerror = function() {
        textureInfo.loaded = false;
    }

    texture_cache[path] = textureInfo;
    return textureInfo;
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
    ]), gl.DYNAMIC_DRAW);
}

graphics.width = function() {
    return gl.canvas.clientWidth;   
}

graphics.height = function() {
    return gl.canvas.clientHeight;
}