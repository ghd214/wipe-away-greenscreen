async function startWebcam () {
  app.stream = await getStream()
  app.stream.play()

  // Possible values are: 1.01, 1.0, 0.75, 0.50
  // Bigger values mean more accuracy at lowered performance
  // Use 0.5 for mobile devices
  app.posenet = await posenet.load(.5)
  // Possible values are: 1.0, 0.75, 0.50, 0.25
  app.bodypix = await bodyPix.load(.5)

  mainLoop()
}

/**
 * The Main Draw Loop
 */
async function mainLoop () {
  renderBodyPix()  
  renderPoseNet()
  requestAnimationFrame(mainLoop)
}

/**
 * Render PoseNet
 */
async function renderPoseNet () {
  const width = app.config.video.width
  const height = app.config.video.height

  app.pose.posenet = await app.posenet.estimateSinglePose(app.$.video.webcam, app.config.posenet.imageScaleFactor, true, app.config.posenet.outputStride)
  app.ctx.posenet.clearRect(0, 0, width, height)
  app.ctx.posenet.drawImage(app.$.video.webcam, 0, 0, width, height)
  drawPoseNetMask(app.pose.posenet)
}

/**
 * Render BodyPix
 */
async function renderBodyPix () {
  const width = app.config.video.width
  const height = app.config.video.height

  app.pose.bodypix = await app.bodypix.estimatePersonSegmentation(app.$.video.webcam, app.config.bodypix.outputStride, app.config.bodypix.segmentationThreshold)
  const mask = bodyPix.toMaskImageData(app.pose.bodypix, false)

  app.ctx.bodypix.globalCompositeOperation = 'source-in'
  app.ctx.bodypix.putImageData(mask, 0, 0)
  app.ctx.bodypix.drawImage(app.$.video.webcam, 0, 0, width, height)
}

/**
 * Draws an alpha mask with your hands (keypoints 9, 10)
 * @see https://github.com/tensorflow/tfjs-models/tree/master/posenet#keypoints
 */
function drawPoseNetMask (pose) {
  if (pose.keypoints[9].score > app.config.posenet.minPartConfidence) addToPoseNetMask(pose.keypoints[9])
  if (pose.keypoints[10].score > app.config.posenet.minPartConfidence) addToPoseNetMask(pose.keypoints[10])
}

/**
 * Adds a filled circle around wrist keypoint to the existing mask
 */
function addToPoseNetMask (keypoint) {
  const ctx = app.ctx.posenetMask

  ctx.beginPath()
  ctx.arc(keypoint.position.x * -1 + app.config.video.width, keypoint.position.y, 30, 0, 2 * Math.PI)
  ctx.fillStyle = '#fff'
  ctx.fill()
}