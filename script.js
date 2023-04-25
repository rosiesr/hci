// Define the list of power poses
var poses = [
	"pose1.jpg",
	"pose2.jpg",
	"pose3.jpg",
	"pose4.jpg"
];

// Set the initial pose image and page number
var imageIndex = Math.floor(Math.random() * poses.length);
var pageNumber = 1;
document.getElementById("pose-image").src = poses[imageIndex];
document.getElementById("pose-page").textContent = "Pose " + pageNumber + "/3";

// Start the timer to change poses
var countdownElement = document.getElementById("countdown");
var countdown = 15;
var poseChanges = 0;
var timer = setInterval(function() {
	countdown--;
	countdownElement.textContent = countdown;
	if (countdown === 0) {
		countdown = 15;
		poseChanges++;
		if (poseChanges === 3) {
			clearInterval(timer);
			window.location.href = "/";
		} else {
			imageIndex = Math.floor(Math.random() * poses.length);
			document.getElementById("pose-image").src = poses[imageIndex];
			pageNumber++;
			document.getElementById("pose-page").textContent = "Pose " + pageNumber + "/3";
		}
	}
}, 1000);