// This file handles all the boring stuff

/**
 * Start Webcam
 */
async function getStream () {
  // Throw up if on old IE, both figuratively here and literally IRL
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Browser API navigator.mediaDevices.getUserMedia not available')
  }

  // Set internal rendering size, so that we can apply 100% width/height in CSS
  app.config.video.height = app.config.video.width * app.config.video.heightRatio
  Object.keys(app.$.video).forEach(key => {
    app.$.video[key].width = app.config.video.width
    app.$.video[key].height = app.config.video.height
  })

  // Get the stream
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
      width: isMobile() ? undefine : app.config.video.width,
      height: isMobile() ? undefine : app.config.video.height
    }
  })
  // console.log(stream)
  app.$.video.webcam.srcObject = stream

  return new Promise((resolve) => {
    app.$.video.webcam.onloadedmetadata = () => {
      resolve(app.$.video.webcam)
    }
  })
}

/**
 * Helpers for checking if we're on mobile
 */
function isMobile () {return isAndroid() || isiOS()}
function isAndroid () {return /Android/i.test(navigator.userAgent)}
function isiOS () {return /iPhone|iPad|iPod/i.test(navigator.userAgent)}

/**
 * Draws posenet keypoints
 */
function drawPoseNetKeypoints () {
  app.pose.posenet.keypoints.forEach((pose, key) => {
    if (pose.score > app.config.posenet.minPartConfidence) drawPoseNetKeypoint(pose)
  })
}

/**
 * Draws a keypoint
 */
function drawPoseNetKeypoint (pose) {
  app.ctx.bodypix.globalCompositeOperation = 'source-over'
  const ctx = app.ctx.bodypix
  
  ctx.beginPath()
  ctx.arc(pose.position.x * -1 + app.config.video.width, pose.position.y, 20, 0, 2 * Math.PI)
  ctx.fillStyle = '#0f0'
  ctx.fill()
}