const vertexShaderSource = `
 attribute vec4 a_position; 
    uniform mat4 u_matrix;     

    void main() {
        gl_Position = u_matrix * a_position; 
    }`
    ;

const fragmentShaderSource = `
 precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
    }
`;



const main = () => {
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl");

    // Hàm tạo shader
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    // Hàm tạo chương trình WebGL
    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

   

    // Tạo shader từ mã nguồn
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Tạo chương trình WebGL
    const program = createProgram(gl, vertexShader, fragmentShader);

    // Lấy vị trí của các thuộc tính và biến uniform trong shader
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

    // Tạo buffer để lưu vị trí của tam giác
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tọa độ 3 đỉnh của tam giác
    const positions = [
        0, 0.5,  // Đỉnh trên
        -0.5, -0.5,  // Đỉnh trái
        0.5, -0.5   // Đỉnh phải
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Thiết lập kích thước viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Xóa canvas trước khi vẽ
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Sử dụng chương trình WebGL vừa tạo
    gl.useProgram(program);

    // Kích hoạt thuộc tính vị trí
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Liên kết buffer vị trí
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const size = 2;          // 2 thành phần mỗi đỉnh (x, y)
    const type = gl.FLOAT;   // Kiểu dữ liệu là số thực
    const normalize = false; // Không chuẩn hóa dữ liệu
    const stride = 0;        // Bước nhảy giữa các đỉnh
    const offset = 0;        // Offset đầu tiên
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // Tạo ma trận biến đổi (ví dụ: xoay 45 độ và dịch chuyển)
    let angleInRadians = 45 * Math.PI / 180;
    let cos = Math.cos(angleInRadians);
    let sin = Math.sin(angleInRadians);
    let translation = [0.2, 0.0];  // Dịch chuyển tam giác sang phải

    // Ma trận 3x3 cho phép biến đổi 2D (bao gồm xoay và dịch chuyển)
    const matrix = [
        cos, -sin, 0,
        sin, cos, 0,
        translation[0], translation[1], 1
    ];

    // Gửi ma trận lên shader
    gl.uniformMatrix3fv(matrixUniformLocation, false, new Float32Array(matrix));

    // Vẽ tam giác
    const primitiveType = gl.TRIANGLES;
    const drawOffset = 0;
    const count = 3;
    gl.drawArrays(primitiveType, drawOffset, count);

}


main();