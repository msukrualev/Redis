const term = require("terminal-kit").terminal;

const users = [
    [
        "NAME",
        "SURNAME",
        "EMAIL"
    ],
    [
        "M",
        "S",
        "m@s.com"
    ],
    [
        "A",
        "B",
        "a@b.com"
    ],
    [
        "C",
        "D",
        "c@d.com"
    ]
]

/* TABLE */
// term.table(users, {
//     hasBorder: true
// })

/* LINE CHANGE */
// term.nextLine(1);
// term.previousLine(1);
// term.nextLine(1);

/* LOG */
// term.white("Hello World");
// term.nextLine(1);
// term.magenta("Hello World");
// term.nextLine(1);
// term.cyan.bold("Hello World");
// term.nextLine(1);
// term.red.italic("Hello World");
// term.nextLine(1);
// term.yellow.underline("Hello World");
// term.nextLine(1);
// term.green.blink("Hello World");
// term.nextLine(1);
// term.bell("Hello World");
// term.nextLine(1);

term.on("key", (key) => {
    if (key === "CTRL_C") {
        term.clear('');
        process.exit(0);
    }
})

// term.inputField({
//     submitKey: 'Enter'
// }, (err, Input) => {
//     if (err) {
//         term.red(err);
//         return;
//     }
//     term.nextLine(1);
//     term.white.bold(`You wrote ${Input}`);
//     term.nextLine(1);
// })

// term.white.bold("Yes or No");
// term.nextLine(1);
// term.yesOrNo({
//     echoYes: false,
//     echoNo: false
// }, (err, arg) => {
//     if (err) {
//         term.red(err);
//     }
//     if (arg) {
//         term.green('You said YES');
//     } else {
//         term.red('You said NO');
//     }
// })

term.white("CLEAR ME");
term.clear();