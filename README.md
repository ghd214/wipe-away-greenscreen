# Wipe Away Greenscreen

![](https://media.giphy.com/media/UW2ajjFyi4WCnMQxNg/source.gif)

This project uses TensorFlow's [PoseNet](https://github.com/tensorflow/tfjs-models/tree/master/posenet) and [BodyPix](https://github.com/tensorflow/tfjs-models/tree/master/body-pix) together to allow you to erase your environment with your hands.

It works by using BodyPix to extract the pixels that represent you. Using PoseNet, you paint onto an image mask with your wrists. Then, the bodypix pixels are placed back over the masked out feed.

This experiment was done to start researching ways to bring the classic [Nick Arcade gameshow](https://www.youtube.com/watch?v=nSCFlafbXBs) to the web:

More info coming soon!