# Clicker Project

This project is a proof of concept clicker implementation.
"Clickers" are RF devices given to students in lectures allowing
them to submit answers to multi-choice questions. Here we make the
assumption that all students will have cell phones.

This little tool is meant to let a lecture/teacher/demonstrator
poll the class to gauge understanding.

This project requires a server running PHP and uses an sqlite
database. This is in contrast to the [jsclicker](https://github.com/mchilcott/jsclicker) project which requires
no server-side code, but uses modern browser techniques, which are
not available on many phones. (And from which much code has been stolen.)

This system is easily hijacked or interfered with, so should not be
used in a public setting without modification.

## Usage

After uploading to a server, access
`question_model.php?install`. This will create the database
silently.

Then point students towards `clicker.html` and point the teacher's
computer towards `dashboard.html`. Student's can submit answers to
the current question.

The student's historic answers are stored in the database for
future analysis, though the interface to retrieve this is not yet
implemented.
