/* Some code snippets of this file were copied from the default alert module https://github.com/MichMich/MagicMirror/tree/development/modules/default/alert */

Module.register("MMM-StopwatchTimer", {
defaults: {
	animation: false
},

getStyles: function() {
	return ["notificationFX.css", "font-awesome.css"];
},

start: function() {
	this.isVisible = false;
	this.firstMessage = true;
},

notificationReceived: function(notification, payload, sender) {
  switch(notification) {
    case "START_TIMER":
		this.minutes = Math.floor(payload / 60);
		this.seconds = (payload % 60);
		this.initialiseTimer();
		break
	case "STOP_TIMER":
		this.minutes = -1;
		this.seconds = -1;
		clearInterval(this.Timer);
		this.removeOverlay();
	  	break
	case "PAUSE_TIMER":
		clearInterval(this.Timer);
		break
	case "UNPAUSE_TIMER":
		if(this.minutes > -1 && this.seconds > -1) {
			this.initialiseTimer();
		}
		break
  }
},

initialiseTimer: function(){
	clearInterval(this.Timer);
	if(this.isVisible) {
    	this.removeOverlay();
    }
    this.createOverlay();
    this.Timer = setInterval(()=>{this.createTimer()}, 1000)
},

createOverlay: function() {
	const overlay = document.createElement("div");
	overlay.id = "overlay";
	overlay.innerHTML += '<div class="black_overlay"></div>';
	document.body.insertBefore(overlay, document.body.firstChild);
	this.ntf = document.createElement("div")
	this.isVisible = true;
},

removeOverlay: function() {
	const overlay = document.getElementById("overlay");
	overlay.parentNode.removeChild(overlay);
	document.body.removeChild(this.ntf);
	this.isVisible = false;
	this.firstMessage = true;
},


displayMessageNoPopup: function(message) {
  let strinner = '<div class="ns-box-inner">';
  strinner += "<span class='regular normal medium'>" + message + "</span>";
  strinner += "</div>";
  this.ntf.innerHTML = strinner;
  if(this.firstMessage) {
  	this.ntf.className = "ns-alert ns-growl ns-effect-jelly ns-type-notice ns-show"
  	document.body.insertBefore(this.ntf, document.body.nextSibling);
  	this.firstMessage = false;
  }
},

createTimer: function() {
		if(this.minutes == 0 && this.seconds == 0){
			this.decreaseTime();
			this.displayMessageNoPopup('Done');
			setTimeout(() => {
				this.removeOverlay()
			}, 3000);
		}
		if(this.minutes > 0 || this.seconds > 0) {
			if(this.seconds < 10) {
				this.displayMessageNoPopup(this.minutes + ':0' + this.seconds);
			} else {
				this.displayMessageNoPopup(this.minutes + ':' + this.seconds);
			}
			this.decreaseTime();
		}
},

decreaseTime: function() {
	if(this.seconds > 0) {
		this.seconds--
	} else {
		if(this.minutes > 0) {
			this.minutes--
			this.seconds = 59;
		} else {
			this.minutes = -1;
			this.seconds = -1;	
		}
	}	
},

increaseTime: function() {
	if(this.seconds < 59) {
		this.seconds++
	} else {
		this.seconds = 0;
		this.minutes++;
	}
},
})
