var expanded = false;
var expandedButtonId = 0;
var index=0;

function getIndex()
{
  if(index == 3)
    index = 0;
  else index++;
  return index;

}


/******************ROS STUFF ***********************************************/
  var ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
  });

    var speechClient = new ROSLIB.ActionClient({
    ros : ros,
    serverName : 'nuance_speech_tts',
    actionName : 'woz_dialog_msgs/SpeechAction'
  });


/***************************************************************************/

function speakYesNo(button)
{
	if(expanded)
	  return;

	//var index = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
	var toSay = {};

	if(button.id == "btn_yes")
	{
		toSay = dictionary["btn_yes"].valor[getIndex()];
	}
	else
	{
		toSay = dictionary["btn_no"].valor[getIndex()];
	}

	  var goal = new ROSLIB.Goal({
    actionClient : speechClient,
    goalMessage : {
      language : 'pt_PT',
      voice: 'Joana',
      message: toSay
    }
  });

  goal.on('feedback', function(feedback) {
    console.log('Feedback: ' + feedback.sequence);
  });

  goal.on('result', function(result) {
    console.log('Final Result: ' + result.success);
  });

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });

	goal.send();


}

function speak(clickedJoint)
{
	
	//Speak
	//Select a random sentence
	//var index = Math.floor(Math.random() * (3 - 0 + 1)) + 0;

	//Get the sentence of that joint button
	var toSay = dictionary[clickedJoint.id].valor[getIndex()];

  var goal = new ROSLIB.Goal({
    actionClient : speechClient,
    goalMessage : {
      language : 'pt_PT',
      voice: 'Joana',
      message: toSay
    }
  });

  goal.on('feedback', function(feedback) {
    console.log('Feedback: ' + feedback.sequence);
  });

  goal.on('result', function(result) {
    console.log('Final Result: ' + result.success);
  });

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });

	goal.send();

	
	//Vizzy spoke. Unexpand everything
	id = expandedButtonId;
	var query = "g:not(#"+id+").group_button"
	var elementsToUnBlur = document.querySelectorAll(query);

	for(var i=0; i<elementsToUnBlur.length; i++)
	{
		var button = elementsToUnBlur[i];
	  	button.classList.remove('chilled');
	}

	unexpand_inner(id);

	expanded = false;
	expandedButtonId = 0;
}

function expand(clickedButton)
{
  
  var id = clickedButton.id;
  var query = ":not(#"+id+").group_button"


  if(expanded)
  {
  	if(expandedButtonId == id)
  	{
  	  var elementsToUnBlur = document.querySelectorAll(query);

  	  for(var i=0; i<elementsToUnBlur.length; i++)
	  {
	  	var button = elementsToUnBlur[i];
	  	button.classList.remove('chilled')
	  }

	  unexpand_inner(id);

	  expanded = false;
	  expandedButtonId = 0;




  	}else
  	  return;
  }else{

  //Glass out all other elements not belonging to the clicked button
  var elementsToBlur = document.querySelectorAll(query);

  for(var i=0; i<elementsToBlur.length; i++)
  {
  	var button = elementsToBlur[i];
  	button.classList.add('chilled')
  }


  //Expand the the option buttons

  expand_inner(id);

  expanded = true;
  expandedButtonId = id;
  }


}

function expand_inner(id)
{
	var query = "."+id+"_joint";
	var elementsToSee = document.querySelectorAll(query);

	for(var i=0; i < elementsToSee.length; i++)
	{
		var joint = elementsToSee[i];
		joint.style.display = "inline";
	}

}

function unexpand_inner(id)
{

	var query = "."+id+"_joint";
	var elementsToSee = document.querySelectorAll(query);

	for(var i=0; i < elementsToSee.length; i++)
	{
		var joint = elementsToSee[i];
		joint.style.display = "none";
	}

}
