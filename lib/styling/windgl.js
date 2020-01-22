// somehow @ alias  is  not working on these imports....

import drawVert from '@/lib/shaders/draw.vert.glsl'
import drawFrag from '@/lib/shaders/draw.frag.glsl'
import quadVert from '@/lib/shaders/quad.vert.glsl'
import screenFrag from '@/lib/shaders/screen.frag.glsl'
import updateFrag from '@/lib/shaders/update.frag.glsl'

const defaultRampColors = {
  0.0: '#3288bd',
  0.1: '#66c2a5',
  0.2: '#abdda4',
  0.3: '#e6f598',
  0.4: '#fee08b',
  0.5: '#fdae61',
  0.6: '#f46d43',
  1.0: '#d53e4f'
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)

  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader))
  }

  return shader
}

function createProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram()

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program))
  }

  const wrapper = { program: program }

  const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
  for (let i = 0; i < numAttributes; i++) {
    const attribute = gl.getActiveAttrib(program, i)
    wrapper[attribute.name] = gl.getAttribLocation(program, attribute.name)
  }
  const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i$1 = 0; i$1 < numUniforms; i$1++) {
    const uniform = gl.getActiveUniform(program, i$1)
    wrapper[uniform.name] = gl.getUniformLocation(program, uniform.name)
  }

  return wrapper
}

function createTexture(gl, filter, data, width, height) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  if (data instanceof Uint8Array) {
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      data
    )
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data)
  }
  gl.bindTexture(gl.TEXTURE_2D, null)
  return texture
}

function bindTexture(gl, texture, unit) {
  gl.activeTexture(gl.TEXTURE0 + unit)
  gl.bindTexture(gl.TEXTURE_2D, texture)
}

function createBuffer(gl, data) {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  return buffer
}

function bindAttribute(gl, buffer, attribute, numComponents) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.enableVertexAttribArray(attribute)
  gl.vertexAttribPointer(attribute, numComponents, gl.FLOAT, false, 0, 0)
}

function bindFramebuffer(gl, framebuffer, texture) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  if (texture) {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    )
  }
}

const WindGL = function WindGL(gl) {
  this.gl = gl

  this.fadeOpacity = 0.996 // how fast the particle trails fade on each frame
  this.speedFactor = 0.25 // how fast the particles move
  this.dropRate = 0.003 // how often the particles move to a random place
  this.dropRateBump = 0.01 // drop rate increase relative to individual particle speed

  this.drawProgram = createProgram(gl, drawVert, drawFrag)
  this.screenProgram = createProgram(gl, quadVert, screenFrag)
  this.updateProgram = createProgram(gl, quadVert, updateFrag)

  this.quadBuffer = createBuffer(
    gl,
    new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])
  )
  this.framebuffer = gl.createFramebuffer()

  this.setColorRamp(defaultRampColors)
  this.resize()
}

const prototypeAccessors = { numParticles: {} }

WindGL.prototype.resize = function resize() {
  const gl = this.gl
  const emptyPixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4)
  // screen textures to hold the drawn screen for the previous and the current frame
  this.backgroundTexture = createTexture(
    gl,
    gl.NEAREST,
    emptyPixels,
    gl.canvas.width,
    gl.canvas.height
  )
  this.screenTexture = createTexture(
    gl,
    gl.NEAREST,
    emptyPixels,
    gl.canvas.width,
    gl.canvas.height
  )
}

WindGL.prototype.setColorRamp = function setColorRamp(colors) {
  // lookup texture for colorizing the particles according to their speed
  this.colorRampTexture = createTexture(
    this.gl,
    this.gl.LINEAR,
    getColorRamp(colors),
    16,
    16
  )
}

prototypeAccessors.numParticles.set = function(numParticles) {
  const gl = this.gl

  // we create a square texture where each pixel will hold a particle position encoded as RGBA
  const particleRes = (this.particleStateResolution = Math.ceil(
    Math.sqrt(numParticles)
  ))
  this._numParticles = particleRes * particleRes

  const particleState = new Uint8Array(this._numParticles * 4)
  for (let i = 0; i < particleState.length; i++) {
    particleState[i] = Math.floor(Math.random() * 256) // randomize the initial particle positions
  }
  // textures to hold the particle state for the current and the next frame
  this.particleStateTexture0 = createTexture(
    gl,
    gl.NEAREST,
    particleState,
    particleRes,
    particleRes
  )
  this.particleStateTexture1 = createTexture(
    gl,
    gl.NEAREST,
    particleState,
    particleRes,
    particleRes
  )

  const particleIndices = new Float32Array(this._numParticles)
  for (let i$1 = 0; i$1 < this._numParticles; i$1++) {
    particleIndices[i$1] = i$1
  }
  this.particleIndexBuffer = createBuffer(gl, particleIndices)
}
prototypeAccessors.numParticles.get = function() {
  return this._numParticles
}

WindGL.prototype.setWind = function setWind(windData) {
  this.windData = windData
  this.windTexture = createTexture(this.gl, this.gl.LINEAR, windData.image)
}

WindGL.prototype.draw = function draw() {
  const gl = this.gl
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.STENCIL_TEST)

  bindTexture(gl, this.windTexture, 0)
  bindTexture(gl, this.particleStateTexture0, 1)

  this.drawScreen()
  this.updateParticles()
}

WindGL.prototype.drawScreen = function drawScreen() {
  const gl = this.gl
  // draw the screen into a temporary framebuffer to retain it as the background on the next frame
  bindFramebuffer(gl, this.framebuffer, this.screenTexture)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  this.drawTexture(this.backgroundTexture, this.fadeOpacity)
  this.drawParticles()

  bindFramebuffer(gl, null)
  // enable blending to support drawing on top of an existing background (e.g. a map)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  this.drawTexture(this.screenTexture, 1.0)
  gl.disable(gl.BLEND)

  // save the current screen as the background for the next frame
  const temp = this.backgroundTexture
  this.backgroundTexture = this.screenTexture
  this.screenTexture = temp
}

WindGL.prototype.drawTexture = function drawTexture(texture, opacity) {
  const gl = this.gl
  const program = this.screenProgram
  gl.useProgram(program.program)

  bindAttribute(gl, this.quadBuffer, program.a_pos, 2)
  bindTexture(gl, texture, 2)
  gl.uniform1i(program.u_screen, 2)
  gl.uniform1f(program.u_opacity, opacity)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

WindGL.prototype.drawParticles = function drawParticles() {
  const gl = this.gl
  const program = this.drawProgram
  gl.useProgram(program.program)

  bindAttribute(gl, this.particleIndexBuffer, program.a_index, 1)
  bindTexture(gl, this.colorRampTexture, 2)

  gl.uniform1i(program.u_wind, 0)
  gl.uniform1i(program.u_particles, 1)
  gl.uniform1i(program.u_color_ramp, 2)

  gl.uniform1f(program.u_particles_res, this.particleStateResolution)
  gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin)
  gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax)

  gl.drawArrays(gl.POINTS, 0, this._numParticles)
}

WindGL.prototype.updateParticles = function updateParticles() {
  const gl = this.gl
  bindFramebuffer(gl, this.framebuffer, this.particleStateTexture1)
  gl.viewport(0, 0, this.particleStateResolution, this.particleStateResolution)

  const program = this.updateProgram
  gl.useProgram(program.program)

  bindAttribute(gl, this.quadBuffer, program.a_pos, 2)

  gl.uniform1i(program.u_wind, 0)
  gl.uniform1i(program.u_particles, 1)

  gl.uniform1f(program.u_rand_seed, Math.random())
  gl.uniform2f(program.u_wind_res, this.windData.width, this.windData.height)
  gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin)
  gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax)
  gl.uniform1f(program.u_speed_factor, this.speedFactor)
  gl.uniform1f(program.u_drop_rate, this.dropRate)
  gl.uniform1f(program.u_drop_rate_bump, this.dropRateBump)

  gl.drawArrays(gl.TRIANGLES, 0, 6)

  // swap the particle state textures so the new one becomes the current one
  const temp = this.particleStateTexture0
  this.particleStateTexture0 = this.particleStateTexture1
  this.particleStateTexture1 = temp
}

Object.defineProperties(WindGL.prototype, prototypeAccessors)

function getColorRamp(colors) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = 256
  canvas.height = 1

  const gradient = ctx.createLinearGradient(0, 0, 256, 0)
  for (const stop in colors) {
    gradient.addColorStop(+stop, colors[stop])
  }

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 1)

  return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data)
}

export default WindGL
