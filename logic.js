// Adapted from https://p5js.org/examples/interaction-snake-game.html
//
let host = "cpsc484-04.yale.internal:8888";
$(document).ready(function() {
  frames.start();
});

const START = 0;
const TUTORIAL = 1;
const NUMUSERS = 2;
const ACCOMPLISHMENTS = 3;
const COMPLIMENT = 4;
const POWER_POSE_INSTRUCTIONS = 5;
const POWER_POSE = 6;
const CONCLUSION = 7;

let frames = {
  socket: null,
  timer_end: null,
  wait_ms: null,
  app_state: START,

  start: function() {
    let url = "ws://" + host + "/frames";
    frames.socket = new WebSocket(url);
    frames.socket.onmessage = function (event) {

      switch(app_state) {
        case START:
          let user_raising_hand = frames.is_user_raising_hand(JSON.parse(event.data));
          if (user_raising_hand) {
            app_state = TUTORIAL;
          }
          break;
        case TUTORIAL:
          let user_t_posing = frames.is_user_t_posing(JSON.parse(event.data));
          if (user_t_posing) {
            app_state = NUMUSERS;
          }
          break;
        case NUMUSERS:
          wait_and_transition(10000, ACCOMPLISHMENTS, event);
          break;
        case ACCOMPLISHMENTS:
          wait_and_transition(10000, COMPLIMENT, event);
          break;
        case COMPLIMENT:
          wait_and_transition(8000, POWER_POSE_INSTRUCTIONS, event);
          break;
        case POWER_POSE_INSTRUCTIONS:
          wait_and_transition(10000, POWER_POSE, event);
          break;
        case POWER_POSE:
          wait_and_transition(20000, CONCLUSION, event);
          break;
        case CONCLUSION:
          wait_and_transition(8000, START, event);
          break;
      }
    }
  },

  wait_and_transition: function (wait_ms, dest_state, event) {
    frames.wait_ms = wait_ms;
    if (frames.is_wait_over(frames.timer, frames.wait_ms)) {
      frames.app_state = dest_state;
      frames.timer = null;
      frames.timer_end = null;
      frames.wait_ms = null;
    } else {
      let user_t_posing = frames.is_user_t_posing(JSON.parse(event.data));
      if (user_t_posing) {
        frames.app_state = START;
      }
    }
  },

  is_wait_over: function (timer, wait_ms) {
    if (!timer) {
      frames.timer = new Date().getTime();
      frames.timer_end = timer + wait_ms;
      return false;
    }
    
    if (timer < timer_end) {
      return false;
    } 
    
    return true;
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
    let hand_left_x = (frame.people[0].joints[8].position.x - pelvis_x) * -1;
    let shoulder_left_x = (frame.people[0].joints[5].position.x - pelvis_x) * -1;
    let hand_right_x = (frame.people[0].joints[15].position.x - pelvis_x) * -1;
    let shoulder_right_x = (frame.people[0].joints[12].position.x - pelvis_x) * -1;

    left_arm_in_line = ((hand_left_x - 50 < shoulder_left_x) || (hand_left_x + 50 > shoulder_left_x));
    right_arm_in_line = ((hand_right_x - 50 < shoulder_right_x) || (hand_right_x + 50 > shoulder_right_x)); 
    // had a check for left_and_right_arms_in_line before, but if left and right are in line alone they should already be in line with eachother
    if (left_arm_in_line && right_arm_in_line) {
      console.log("t-pose detected!");
      return true;
    }

    return false;
  },
}
