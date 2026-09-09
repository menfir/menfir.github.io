---
name: Score Card Generator
description: Print-ready score cards for an indoor boulder competition, straight from the participant export.
link: /scorecard-generator/
embed: false
repoUrl: https://github.com/menfir/scorecard-generator
---

Feed it the participant export and a mapping of which boulders each category
climbs, and it prints the score cards. Interface and cards in Dutch, French and
English, set independently — a Dutch organiser can print French cards for
francophone participants.

It replaced a Word template, a mail merge, and someone writing boulder numbers on
sixty cards by hand the night before.

Three constraints shaped it, and all three pushed the same way — toward one HTML
file with no build step:

- **It has to run offline.** A sports hall has bad wifi at the worst possible
  moment. You open the file from a USB stick and it works.
- **Nothing may leave the device.** Participant lists are names of minors. All
  parsing and rendering is client-side; at runtime there is no network call to
  make, because there is nothing to call.
- **Printing is the browser's job.** Ctrl+P, save as PDF, done. No PDF library.
