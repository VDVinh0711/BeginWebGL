const vertexShaderSource = `
    attribute vec2 a_position;
attribute vec4 a_color;
varying vec4 v_color;
void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_color = a_color;
}`
    ;

const fragmentShaderSource = `
 precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
    }
`;


function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}



const main = () =>
{
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl');
    

    const program = createProgram(gl,vertexShaderSource,fragmentShaderSource);

    const positionAtribute = gl.getAttribLocation(program,"a_position");
    const colorAtribute = gl.getAttribLocation(program,"a_color");

    //Set for pos
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

    const positions = [
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);

    const color = [
        Math.random() *255 ,Math.random() *255,Math.random() *255,1,
        Math.random() *255,Math.random() *255,Math.random() *255,1,
        Math.random() *255,Math.random() *255,Math.random() *255,1
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);


    //Setup pos for canvas
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //Clear rect
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    //SetupPos

    gl.enableVertexAttribArray(positionAtribute);
    gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer);
    gl.vertexAttribPointer(positionAtribute,2,gl.FlOAT,false,0,0);

    gl.drawArrays(gl.TRIANGLES, 0, 6)
}


main();
