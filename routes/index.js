var express = require('express');
var router = express.Router();

// Docker Config
const Docker = require('dockerode')
const docker = new Docker();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({"status":"working"})
});








router.get('/run', async function(req, res, next) {

  
  const apikey = req.headers.apikey
  const portfromuser = req.headers.port

  if(apikey == "utjve2234fnvke32of"){
       

  try {
    const image = "yesutkarshverma/yesrepelitclone:v1.0";
    const port = portfromuser || '3000';  // Default to 3000 if no port is provided

    // Pull the Docker image
    await new Promise((resolve, reject) => {
      docker.pull(image, (err, stream) => {
        if (err) return reject(err);
        docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
      });
    });

    // Create the Docker container
    const container = await docker.createContainer({
      Image: image,
      AttachStdout: true,
      // name:"utkarsh",
      HostConfig: {
        PortBindings: {
          '3000/tcp': [{ HostPort: port, HostIp: "0.0.0.0" }]
        }
      },
      ExposedPorts:{
        '3000/tcp':{}
      }
    });
    

    // Start the Docker container
    await container.start();

    // Send a success response to the client
    res.status(200).json({
      status:"started",
      port:port,
      id:container.id,
    });

  } catch (error) {
    // Handle any errors
    console.error("Error running the container:", error);
    res.status(500).send("Failed to start the container");
  }

}
else{
  res.json({
    status:'wrong api key'
  })
}

});

module.exports = router;
