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
const powerPoseFile = "6powerPose.html";
const CONCLUSION = 7;
const conclusionFile = "7conclusion.html";

let frames = {
  socket: null,
  timer_end: null,
  app_state: START,
  prev_state: START,

  start: function() {
    let url = "ws://" + host + "/frames";
    frames.socket = new WebSocket(url);
    frames.socket.onmessage = function (event) {

      switch(frames.app_state) {
        case START:
          frames.set_page(startFile);
          frames.wait_and_transition(5, TUTORIAL, event);
          let user_raising_hand = frames.is_user_raising_hand(JSON.parse(event.data));
          // console.log("user_raising_hand: " + user_raising_hand);
          if (user_raising_hand) {
            console.log("hand raised in start");
            frames.transition_to_state(TUTORIAL);
          }
          break;
        case TUTORIAL:
          // console.log("in tutorial");
          frames.set_page(tutorialFile);
          frames.wait_and_transition(5, NUMUSERS, event);
          // let user_t_posing = frames.is_user_t_posing(JSON.parse(event.data));
          // console.log("t pose checked");
          // if (user_t_posing) {
          //   console.log("t pose detected in tutorial");
          //   frames.transition_to_state(NUMUSERS);
          // }
          break;
        case NUMUSERS:
          frames.set_page(numUsersFile);
          frames.wait_and_transition(5, ACCOMPLISHMENTS, event);
          break;
        case ACCOMPLISHMENTS:
          frames.set_page(accomplishmentsFile);
          frames.wait_and_transition(5, COMPLIMENT, event);
          break;
        case COMPLIMENT:
          frames.set_page(complimentFile);
          frames.wait_and_transition(5, POWER_POSE_INSTRUCTIONS, event);
          break;
        case POWER_POSE_INSTRUCTIONS:
          frames.set_page(powerPoseInstructionsFile);
          frames.wait_and_transition(5, CONCLUSION, event);
          break;
        case POWER_POSE:
          frames.set_page(powerPoseFile);
          frames.wait_and_transition(5, CONCLUSION, event);
          break;
        case CONCLUSION:
          frames.set_page(conclusionFile);
          frames.wait_and_transition(5, START, event);
          break;
      }
    }
  },

  set_page: function (file) {
    if (frames.prev_state != frames.app_state) {
      window.location.replace(file);
    }
  },

  transition_to_state: function (state) {
    frames.prev_state = frames.app_state;
    frames.app_state = state;
  },

  wait_and_transition: function (wait_in_s, state, event) {
    if (!frames.timer_end) {
      frames.timer_end = new Date().getTime() + (wait_in_s *  1000);
      return;
    }
    
    currentTime = new Date().getTime();
    if (currentTime >= frames.timer_end) {
      frames.timer_end = null;
      frames.transition_to_state(state);
      return;
    } else {
      // let user_t_posing = frames.is_user_t_posing(JSON.parse(event.data));
      // if (user_t_posing) {
      //   frames.timer_end = null;
      //   frames.transition_to_state(START);
      // }
      // return;
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
