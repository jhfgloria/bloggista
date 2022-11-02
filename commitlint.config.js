const matchAnyEmojiWithSpaceAfter = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])\s/;
const subjectThatDontStartWithBracket = /([^\[].+)/; // "Add tests" but don't allow "[ Add tests"
// TODO: Reintroduce in case it makes sense
// const matchOptionalTicketNumberWithSpaceAfter = /(?:\[(T-\d+)\]\s)?/; // "[T-4605] ", "[T-1]"


module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: new RegExp(
        "^" +
          matchAnyEmojiWithSpaceAfter.source +
          // matchOptionalTicketNumberWithSpaceAfter.source +
          subjectThatDontStartWithBracket.source +
          "$"
      ),
      headerCorrespondence: ["emoji", "ticket", "subject"],
    },
  },
  plugins: [
    {
      rules: {
        "header-match-team-pattern": (parsed) => {
          const { emoji, /*ticket,*/ subject } = parsed;
          if (emoji === null && /*ticket === null &&*/ subject === null) {
            return [
              false,
              "header must be in format '🚀 Add tests'",
            ];
          }
          return [true, ""];
        },
        "explained-emoji-enum": (parsed, _when, emojisObject) => {
          const { emoji } = parsed;
          if (emoji && !Object.keys(emojisObject).includes(emoji)) {
            return [
              false,
              `emoji must be one of:
${Object.keys(emojisObject)
                .map((emojiType) => `${emojiType} - ${emojisObject[emojiType]}`)
                .join("\n")}`,
            ];
          }
          return [true, ""];
        },
      },
    },
  ],
  rules: {
    "header-match-team-pattern": [2, "always"],
    "explained-emoji-enum": [
      2,
      "always",
      {
        "🚀": "New feature",
        "🐛": "Bug fix",
        "🧹": "Miscellaneous",
      },
    ],
  },
};