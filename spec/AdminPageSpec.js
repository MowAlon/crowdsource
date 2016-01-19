const app = require('../server')
const request = require('request')

describe('Admin page', function(){
  // beforeAll(function(done){
  //   this.port = 9876
  //   this.server = app.listen(this.port, (error, result) => {
  //     if (error) { return done(error) }
  //     done()
  //   })
  // })
  //
  // afterAll(function(){
  //   this.server.close()
  // })
  //
  // beforeEach(function(){
  //   app.locals.polls = {}
  //   app.locals.admins = {}
  // })
  //
  // xit("should return status 200", function(done){
  //   var validPoll = {question: "Question about people",
  //                   responses: {a: "Alon",
  //                               b: "Bret",
  //                               c: "Chase",
  //                               d: ""}
  //   request.post("http://localhost:9876/newpoll", {form: validPoll}, function(error, response) {done()})
  //   var adminKey = Object.keys(app.locals.admins)[0]
  //
  //   request.get("http://localhost:9876/admin/" + adminKey, function(error, response){
  //     if (error) {done(error)}
  //     expect(response.statusCode).toBe(200)
  //     done()
  //   })
  // })
  //
  // xit("shows the poll's question in a page header", function(done){
  //   var adminKey = Object.keys(app.locals.admins)[0]
  //   request.get("http://localhost:9876/admin/" + adminKey, function(error, response){
  //     console.log('app.locals.polls --> ', app.locals.polls)
  //
  //     expect(response.body.includes("<h1>Question about peoplex</h1>")).toBe(true)
  //     done()
  //   })
  // })

})
