# HCI Project
This code implements a mental wellness app on the interactive system for [CPSC 484/584 Intro. to HCI](https://cpsc484-584-hci.gitlab.io/s23/project). The app supports the following key tasks, among some others:

Task 1: Users can record small accomplishments through the display.
Task 2: Users will perform superhero/power poses by following a sequence of poses displayed on the screen, which are intended to quickly reduce stress/anxiety.

As for a technical overview, the app’s frontend is implemented using HTML5 and CSS3. The frontend is made dynamic through a backend implemented in JavaScript. Data is obtained via a WebSocket. 

Technical details for the interactive systems are available on the [course website](https://cpsc484-584-hci.gitlab.io/s23/display_tutorial).


## Quickstart (Installation/How to Run)

The default host is `cpsc484-04.yale.internal:8888`. This project uses purely HTML, CSS, and JS and does not require any dependencies beyond that. To run the app, simply run index.html on a web browser. 

## About the project
This project addresses mental wellness on campus. The purpose is to provide a destressing application through the following two aforementioned tasks:


1. Users can select small accomplishments from the day using the display.
    -This is accomplished through using spatial positioning to answer the question and have users recognize their own accomplishments– no matter how small they may seem.
2. Users will perform superhero/power poses by following a sequence of poses displayed on the screen, which reduces stress.
    -The power pose is a light hearted way to physically engage people in an action that can increase confidence and reduce stress. We also have poses for multiple people to be able to engage with friends. 

## Constraints

This project has few constraints: 

*It requires enough physical space to perform the power poses
*If a user stands too far or too close to the display, it will not always function properly
*Only one person can be in the frame at a time when answering questions with spatial positioning. 

## Collaboration Record
**Eric Sun:** For assignment 6, I worked on 3 different html pages as well as their corresponding css files and finished them completely. Specifically, I worked on the second(numUsers) page, the third (accomplishments) page, and the 6(powerPose) page. For the first two pages, it only required html and css, and the power pose page required javascript functionality. I met with the group at the TV to complete the project and helped debug and suggest ideas to structure our code. I helped test to make sure every part of our application connected well (contributing to the routing and passing of variables through url) and there were no final bugs once we connected all parts together. I then helped with adding the spatial functionality to our project.

**David Katko:** For assignment 6, I refactored the p5.js demo to be used for our project, including cleaning up sketch.js (keeping only what we need), making the first new page (7conclusion.html) and setting up initial basic styles in styles.css. I then worked on using the Kinect data to detect when users raise their hand and when they T-pose. I also worked on using user position to allow them to ‘select’ answer choices during interactive sections of the application. I integrated the processing of spatial data into a backend which controlled the routing of different web pages, which allows transition directly to pages while keeping track of application state, and transition after a specified number of seconds. I actively discussed ideas with my teammates in terms of how to structure and debug the routing and spatial data issues we ran into. Everyone was really cooperative, capable, and fun to work with!

**Rosie Rothschild:** During assignment 6, I created the Power Pose Instruction html page, helped debug a transition issue with my teammates, added the functionality to change the background depending on spatial locality of the individual, and helped test our application to ensure that it was robust throughout. I additionally created the ReadMe and set up a template for our group to fill out to ensure that we completed every part of the assignment. I communicated with our TA to ensure that we could upload our project to the display, and worked with the entire team to debug our code. I really enjoyed working with the entire team!

**Brian Todi:** For assignment 6, I contributed in a variety of ways to equally split the load of work required to finish the web app. I worked with my group in the planning phase to distribute tasks fairly. I then worked on and completed the tasks assigned to me. Specifically, I worked on various frontend pages of the website such as the tutorial page, accomplishment pages, and more. In these pages, I wrote all the HTML5 and CSS3 code. Furthermore, there were some pieces of the JavaScript functionality that I also worked on such as dynamically mapping out accomplishments based on the number of users. Additionally, I worked on the design with regards to the assets used for the power poses section. I also helped to complete a write-up of the project for the GitHub README. Finally, I also contributed ideas, suggestions, and was around for some testing and bug fixing.
