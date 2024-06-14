let gl;
let shaderProgram;
let verticesBuffer;
let time = 0.0;

function loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Erro ao compilar shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initWebGL(canvas) {
    gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL não está disponível.');
        return;
    }

    const vertexShaderSource = `
        attribute vec2 a_position;
        uniform mat4 u_modelViewMatrix;
        void main() {
            gl_PointSize = 20.0; // Tamanho do ponto (opcional, para melhor visualização)
            gl_Position = u_modelViewMatrix * vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist < 0.5) {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Vermelho sólido
            } else {
                discard; // Descartar pixels fora do círculo
            }
        }
    `;

    const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Não foi possível inicializar os shaders.');
        return;
    }

    gl.useProgram(shaderProgram);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
    verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    const vertices = new Float32Array([0.0, 0.0]); // Posição inicial da bola
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.viewport(0, 0, canvas.width, canvas.height);
}

function drawScene() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    time += 0.01;
    const xPos = Math.cos(time) * 0.5; // Movimento horizontal em um arco
    const yPos = Math.abs(Math.sin(time)) * 0.5; // Movimento vertical em um arco

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [xPos, yPos, 0.0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [1.0, 1.0 - yPos * 0.5, 1.0]);

    const matrixLocation = gl.getUniformLocation(shaderProgram, 'u_modelViewMatrix');
    gl.uniformMatrix4fv(matrixLocation, false, modelViewMatrix);

    gl.drawArrays(gl.POINTS, 0, 1);

    requestAnimationFrame(drawScene);
}

window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    initWebGL(canvas);
    drawScene();
};
