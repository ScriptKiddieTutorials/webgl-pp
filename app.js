// Rotating Cube Animatino by Jeff

var vertShaderCode = 
`
precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
  fragColor = vertColor;
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
`

var fragShaderCode =
`
precision mediump float;

varying vec3 fragColor;
void main()
{
  gl_FragColor = vec4(fragColor, 1.0);
}
`

function InitDemo () {
	var canvas = document.getElementById('screen');
	var gl = canvas.getContext('webgl');

	gl.clearColor(0, 0, 0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	// Shaders
	var vertShader = gl.createShader(gl.VERTEX_SHADER);
	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertShader, vertShaderCode);
	gl.shaderSource(fragShader, fragShaderCode);

	gl.compileShader(vertShader);
	gl.compileShader(fragShader);

	var program = gl.createProgram();
	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);

	
	// Buffer
	var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation,
		3,
		gl.FLOAT,
		gl.FALSE,
		6 * 4,
		0
	);
	gl.vertexAttribPointer(
		colorAttribLocation, 
		3,
		gl.FLOAT,
		gl.FALSE,
		6 * 4,
		3 * 4
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0, 3, -8], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	var zRotationMatrix = new Float32Array(16);
	var yzRotationMatrix = new Float32Array(16);

	var xRotAngVel=1;
	var yRotAngVel=0;
	var zRotAngVel=0;


	var sliderX=document.getElementById("xRotationSpeedSlider");
	var sliderY=document.getElementById("yRotationSpeedSlider");
	var sliderZ=document.getElementById("zRotationSpeedSlider");

	sliderX.oninput = () => {xRotAngVel = sliderX.value;};
	sliderY.oninput = () => {yRotAngVel = sliderY.value;};
	sliderZ.oninput = () => {zRotAngVel = sliderZ.value;};
	

	// Render loop
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);

	var angle = 0;
	var grey = 0;
	var loop = function () {
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		mat4.rotate(xRotationMatrix, identityMatrix, angle*xRotAngVel, [0, 1, 0]);
		mat4.rotate(yRotationMatrix, identityMatrix, angle*yRotAngVel, [1, 0, 0]);
		mat4.rotate(zRotationMatrix, identityMatrix, angle*zRotAngVel, [0, 0, 1]);
		
		mat4.mul(yzRotationMatrix, yRotationMatrix, zRotationMatrix); // Multiply y by z
		mat4.mul(worldMatrix, xRotationMatrix, yzRotationMatrix); // Multiply x by yz
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		grey = Math.abs(1000-(performance.now() % 2000))/ 1000;
		gl.clearColor(grey, grey, grey, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
};
