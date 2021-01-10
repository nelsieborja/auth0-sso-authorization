const faker = require("faker");
const _ = require("lodash");

exports.articles = function () {
  return _.times(4, function (n) {
    return {
      id: n,
      user_id: faker.internet.email(),
      date: faker.date.recent(),
      title: faker.lorem.sentence(2),
      body: faker.lorem.sentences(1),
    };
  });
};
