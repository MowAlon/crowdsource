const moment = require('../public/lib/moment.min.js')

module.exports = (requestedData) => {

  if (requestedData === 'polls') {
    var polls = {}

    polls['publicdemo'] =
                 {question: 'Who put the bop in the bop shabop shabop?',
                  responses: {a: "Bret",
                              b: "Matt",
                              c: "That guy in the back of the club",
                              d: "Yogi Bear"},
                  votes: {},
                  comments: [{time: moment().subtract(2, 'days'),
                                     name: 'Clarence',
                                     comment: "Was't it Zach?"},
                             {time: moment().subtract(544, 'minutes'),
                                     name: 'Thomas',
                                     comment: "I always thought it was Queen Latifah."}
                            ]
                 }

    polls['privatedemo'] =
                {question: 'What is your greatest fear?',
                 responses: {a: "Clowns",
                             b: "Jeff's hair",
                             c: "That guy in the back of the club",
                             d: "Black holes"},
                 private: 'on',
                 votes: {},
                 comments: [{time: moment().subtract(2, 'days'),
                                    name: 'Clarence',
                                    comment: "I'm scared of everything!"},
                            {time: moment().subtract(544, 'minutes'),
                                    name: 'Thomas',
                                    comment: "I'm only scared of lawyers!"}
                           ]
                }
    return polls

  } else if (requestedData === 'admins') {
    var admins = {publicdemo: 'publicdemo',
                  privatedemo: 'privatedemo'}
    return admins
  }
}
