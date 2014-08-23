var LogitechDualActionController = require('logitech-dual-action-controller')

var Aerogel = require('aerogel');

var driver = new Aerogel.CrazyDriver();
var copter = new Aerogel.Copter(driver);
//process.on('SIGINT', copter.land.bind(copter));

driver.findCopters()
  .then(function(copters)
  {
    if (copters.length === 0)
    {
      console.error('No copters found! Is your copter turned on?');
      process.exit(1);
    }

    var uri = copters[0];
    console.log('Using copter at', uri);
    return uri;
  })
  .then(function(uri) { return copter.connect(uri); })
  .then(function(){
    console.log('Contoller! Assemble!')
    var controller = new LogitechDualActionController()
    controller.on('1:press', toggleFly)

    controller.on('right:move', thrust)
  })
  .done()

var isFly = false

function thrust (obj) {
  var thrust = map(obj.y, -99, 99, 10001, 30000)
  console.log('thrust', obj, thrust)
  copter.setThrust(thrust)
}

function toggleFly () {
  console.log('toggleFly', isFly)
  if (isFly) {
    console.log('toggleFly landing')
    copter.land()
  } else {
    console.log('toggleFly takeoff')
    copter.takeoff()
  }
  isFly = !isFly
}
toggleFly.isFly = false

function map (x, fromLow, fromHigh, toLow, toHigh) {
  return (x - fromLow) * (toHigh - toLow) /
    (fromHigh - fromLow) + toLow;
}