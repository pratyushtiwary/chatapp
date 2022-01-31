const fs = require("fs");

function analyze(msg) {
  try {
    const data = fs.readFileSync("./bag_of_words.json", "utf8");
    const bag_of_words = JSON.parse(data);
    const final_msgs = msg.split(/\t|\s|\n/);
    if (final_msgs.length < 100) {
      let count = 0,
        score = 0;
      final_msgs.forEach((word) => {
        if (bag_of_words[word.toLowerCase()] != undefined) {
          count += 1;
          score += parseInt(bag_of_words[word]);
        }
      });
      return [count, score];
    } else {
      return [0, 0];
    }
  } catch (err) {
    console.error(err);
    return [0, 0];
  }
}

module.exports = analyze;
