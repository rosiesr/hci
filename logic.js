// Adapted from https://p5js.org/examples/interaction-snake-game.html
//
let host = "cpsc484-04.yale.internal:8888";
$(document).ready(function() {
  frames.start();            //Commented this out for testing purposes but in production must uncomment 
});

const START = 0;
const startFile = "index.html";
const TUTORIAL = 1;
const tutorialFile = "1tutorial.html";
const NUMUSERS = 2;
const numUsersFile = "2numUsers.html";
const ACCOMPLISHMENTS = 3;
const accomplishmentsFile = "3accomplishments.html";
const COMPLIMENT = 4;
const complimentFile = "4compliment.html";
const POWER_POSE_INSTRUCTIONS = 5;
const powerPoseInstructionsFile = "5powerPoseInstructions.html";
const POWER_POSE = 6;
const powerPoseFile = "6powerpose.html";
const CONCLUSION = 7;
const conclusionFile = "7conclusion.html";

let current_position = null;

let frames = {
  socket: null,
  timer_end: null,
  app_state: null,
  num_users: null,

  start: function() {
    console.log("querying params");
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has('app_state')) {
      frames.app_state = parseInt(queryParams.get('app_state'));
    } else {
      frames.app_state = START;
    }

    if (queryParams.has('num_users')) {
      frames.num_users = parseInt(queryParams.get('num_users'));
    } else {
      frames.num_users = 1;
    }

    console.log("frames.app_state: " + frames.app_state);
    console.log("frames.num_users: " + frames.num_users);

    let url = "ws://" + host + "/frames";
    frames.socket = new WebSocket(url);
    frames.socket.onmessage = function (event) {
      switch(frames.app_state) {
        case START:
          let user_raising_hand = frames.is_user_raising_hand(JSON.parse(event.data));
          if (user_raising_hand) {
            console.log("hand raised in start");
            frames.transition(TUTORIAL, tutorialFile);
          }
          break;
        case TUTORIAL:
          let user_t_posing = frames.is_user_t_posing(JSON.parse(event.data));
          if (user_t_posing) {
            frames.transition(NUMUSERS, numUsersFile);
          }
          break;
        case NUMUSERS:
          current_position = frames.get_user_position(JSON.parse(event.data));
          frames.num_users = current_position;
          frames.wait_and_transition(10, ACCOMPLISHMENTS, accomplishmentsFile);
          break;
        case ACCOMPLISHMENTS:
          current_position = frames.get_user_position(JSON.parse(event.data));
          frames.wait_and_transition(12, COMPLIMENT, complimentFile);
          break;
        case COMPLIMENT:
          frames.wait_and_transition(6, POWER_POSE_INSTRUCTIONS, powerPoseInstructionsFile);
          break;
        case POWER_POSE_INSTRUCTIONS:
          frames.wait_and_transition(10, POWER_POSE, powerPoseFile);
          break;
        case POWER_POSE:
          frames.wait_and_transition(5, CONCLUSION, conclusionFile);
          break;
        case CONCLUSION:
          frames.wait_and_transition(6, START, startFile);
          break;
      }
    }
  },

  transition: function (state, file) {
    // console.log("Transitioning from " + frames.app_state + "to " + state);
    window.location.href = `${file}?app_state=${state}&num_users=${frames.num_users}`;
  },

  wait_and_transition: function (wait_in_s, state, file, event) {
    if (!frames.timer_end) {
      frames.timer_end = new Date().getTime() + (wait_in_s *  1000);
      return;
    }
    console.log(frames.timer_end - new Date().getTime());
    
    currentTime = new Date().getTime();
    if (currentTime >= frames.timer_end) {
      console.log("Transitioning from " + frames.app_state + " to " + state);
      frames.timer_end = null;
      frames.transition(state, file);
      return;
    } else {
      let user_t_posing = frames.is_user_t_posing(JSON.parse(event.data));
      if (user_t_posing) {
        frames.timer_end = null;
        frames.transition(START, startFile);
      }
      return;
    }
  },

  get_user_position: function (frame) {
    if (frame.people.length < 1) {
      return false; // no people in the frame
    }

    let pelvis_x = frame.people[0].joints[0].position.x;

    console.log(pelvis_x);

    if (pelvis_x < -80) {
      return 4;
    } else if (pelvis_x < 480) {
      return 3;
    } else if (pelvis_x < 1040) {
      return 2;
    } else {
      return 1;
    }
  },

  is_user_raising_hand: function (frame) {
    if (frame.people.length < 1) {
      return false; // no people in the frame
    }

    // Normalize by subtracting the root (pelvis) joint coordinates
    let pelvis_x = frame.people[0].joints[0].position.x;
    let pelvis_y = frame.people[0].joints[0].position.y;
    // let pelvis_z = frame.people[0].joints[0].position.z;

    let hand_left_x = (frame.people[0].joints[8].position.x - pelvis_x) * -1;
    let hand_left_y = (frame.people[0].joints[8].position.y - pelvis_y) * -1;
    // let hand_left_z = (frame.people[0].joints[8].position.z - pelvis_z) * -1; // should we use this at all?

    let hand_right_x = (frame.people[0].joints[15].position.x - pelvis_x) * -1;
    let hand_right_y = (frame.people[0].joints[15].position.y - pelvis_y) * -1;
    // let hand_right_z = (frame.people[0].joints[15].position.z - pelvis_z) * -1; // should we use this at all?

    let left_hand_raised = hand_left_x < 200 && hand_left_x > -200 && hand_left_y > 500;
    let right_hand_raised = hand_right_x < 200 && hand_right_x > -200 && hand_right_y > 500;
    if (left_hand_raised || right_hand_raised) {
      console.log("hand(s) raised!");
      return true;
    }

    return false; // no hands up
  },

  is_user_t_posing: function (frame) {
    if (frame.people.length < 1) {
      return false;
    }

    // Normalize by subtracting the root (pelvis) joint coordinates
    let pelvis_x = frame.people[0].joints[0].position.x;
    let pelvis_y = frame.people[0].joints[0].position.y;

    let hand_left_x = (frame.people[0].joints[8].position.x - pelvis_x) * -1;
    let hand_left_y = (frame.people[0].joints[8].position.y - pelvis_y) * -1;

    let hand_right_x = (frame.people[0].joints[15].position.x - pelvis_x) * -1;
    let hand_right_y = (frame.people[0].joints[15].position.y - pelvis_y) * -1;

    let shoulder_left_y =(frame.people[0].joints[5].position.y - pelvis_y) * -1;
    let shoulder_right_y = (frame.people[0].joints[12].position.y - pelvis_y) * -1;

    // shoulder
    hands_out_to_side = hand_right_x > 200 && hand_left_x < -200;
    right_arm_in_line = hand_right_y - 50 < shoulder_right_y && hand_right_y + 50 > shoulder_right_y;
    left_arm_in_line = hand_left_y - 50 < shoulder_left_y && hand_left_y + 50 > shoulder_left_y;

    if (hands_out_to_side && left_arm_in_line && right_arm_in_line) {
      console.log("t-pose detected!");
      return true;
    }

    return false;
  },
}
