


let gl;
let program;
let positionBuffer;
let colorBuffer;
let indexBuffer;
let projectionMatrixLocation;
let modelViewMatrixLocation;

const vertexShaderSource = `
    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;
    varying lowp vec4 vColor;
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
        vColor = aVertexColor;
    }
`;

const fragmentShaderSource = `
    varying lowp vec4 vColor;
    void main(void) {
        gl_FragColor = vColor;
    }
`;

function initGL() {
    const canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
}

function initShaderProgram() {
    const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }

    gl.useProgram(program);

    projectionMatrixLocation = gl.getUniformLocation(program, "uProjectionMatrix");
    modelViewMatrixLocation = gl.getUniformLocation(program, "uModelViewMatrix");
}

function loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initBuffers() {
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    colorBuffer = gl.createBuffer();


    setInterval(() => {
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        const colors = [
            [Math.random(), Math.random(), Math.random(), Math.random()],    
            [Math.random(), Math.random(), Math.random(), Math.random()],   
            [Math.random(), Math.random(), Math.random(), Math.random()],    
            [Math.random(), Math.random(), Math.random(), Math.random()],    
            [Math.random(), Math.random(), Math.random(), Math.random()],   
            [Math.random(), Math.random(), Math.random(), Math.random()]     
        ];
        let generatedColors = [];
        for (let j = 0; j < 6; j++) {
            //const c = colors[j];
            for (let i = 0; i < 4; i++) {
                generatedColors = generatedColors.concat([Math.random(), Math.random(), Math.random(), Math.random()]);
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);
    }, 1000);


    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const indices = [
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23    // left
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

function drawScene(rotationX, rotationY) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //SetUp Camere
    const fieldOfView = 45 * Math.PI / 180; // góc nhìn
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight; // tỉ lệ khung hình
    const zNear = 0.1; // khoảng cách gần
    const zFar = 100.0; // khoảng cách xa
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -10.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotationX, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotationY, [0,1,0]);

    mat4.scale(modelViewMatrix,modelViewMatrix,[2,2,2])

    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);



    // set Position
    const vertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // set color
    const vertexColor = gl.getAttribLocation(program, 'aVertexColor');
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColor);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}

let rotationX = 0;
let rotationY = 0;

function render() {


    rotationX += 0.01;
    rotationY += 0.01;
    drawScene(rotationX, rotationY);
    requestAnimationFrame(render);
}

function main() {
    initGL();
    initShaderProgram();
    initBuffers();
    render();
}

main();
