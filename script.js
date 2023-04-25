// Define the list of power poses
var poses = [
	"pose1.jpg",
	"pose2.jpg",
	"pose3.jpg",
	"pose4.jpg"
];

const queryParams = new URLSearchParams(window.location.search);

// Set the number of poses to display
var num_users = parseInt(queryParams.get('num_users'));

// Set the initial pose images and page number
var imageIndexes = [];
var pageNumber = 1;
for (var i = 0; i < num_users; i++) {
	var imageIndex = Math.floor(Math.random() * poses.length);
	imageIndexes.push(imageIndex);
	var poseImage = document.createElement("img");
	poseImage.src = poses[imageIndex];
	poseImage.classList.add("pose-image");
	document.getElementById("poses-container").appendChild(poseImage);
}
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
			window.location.href = "7conclusion.html?app_state=7";
		} else {
			for (var i = 0; i < num_users; i++) {
				var imageIndex = Math.floor(Math.random() * poses.length);
				while (imageIndexes.indexOf(imageIndex) !== -1) {
					imageIndex = Math.floor(Math.random() * poses.length);
				}
				imageIndexes[i] = imageIndex;
				var poseImage = document.getElementsByClassName("pose-image")[i];
				poseImage.src = poses[imageIndex];
			}
			pageNumber++;
			document.getElementById("pose-page").textContent = "Pose " + pageNumber + "/3";
		}
	}
}, 1000);