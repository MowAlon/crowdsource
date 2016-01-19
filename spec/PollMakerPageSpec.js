const app = require('../server')
const request = require('request')

describe("PollMaker", function(){
  beforeAll(function(done){
    this.port = 9876
    this.server = app.listen(this.port, (error, result) => {
      if (error) { return done(error) }
      done()
    })
    // this.request = request.defaults({
    //   baseURL: "http://localhost:9876/"
    // })
  })

  afterAll(function(){
    this.server.close()
  })

  it("should have a required text input field called 'question'", function(done){
    request.get('http://localhost:9876/', (error, response) => {
      if (error) { done(error) }
      expect(response.body.includes("<input required type='text' name='question'")).toBe(true)
      done()
    })
  })

  it("should have a required input field for response[a]", function(done){
    request.get('http://localhost:9876/', (error, response) => {
      if (error) { done(error) }
      expect(response.body.includes("<input required type='text' name='responses[a]'")).toBe(true)
      done()
    })
  })

  it("should have a required input field for response[b]", function(done){
    request.get('http://localhost:9876/', (error, response) => {
      if (error) { done(error) }
      expect(response.body.includes("<input required type='text' name='responses[b]'")).toBe(true)
      done()
    })
  })

  it("should have a required input field for response[c]", function(done){
    request.get('http://localhost:9876/', (error, response) => {
      if (error) { done(error) }
      expect(response.body.includes("name='responses[c]'")).toBe(true)
      done()
    })
  })

  it("should have a required input field for response[d]", function(done){
    request.get('http://localhost:9876/', (error, response) => {
      if (error) { done(error) }
      expect(response.body.includes("name='responses[d]'")).toBe(true)
      done()
    })
  })

  it("should have a checkbox called 'private'", function(done){
    request.get('http://localhost:9876/', (error, response) => {
      if (error) { done(error) }
      console.log(response.body)
      expect(response.body.includes("<input type='checkbox' name='private'")).toBe(true)
      done()
    })
  })

})















// var polls = {}
// polls["publicdemo"] =
//              {question: "Question about people",
//               responses: {a: "Alon",
//                           b: "Bret",
//                           c: "Chase",
//                           d: ""},
//               votes: {clientID1: 'a'},
//               comments: [{time: Date(),
//                           name: "Commenter 1",
//                           comment: "Comment 1"},
//                          {time: Date(),
//                           name: "Commenter 2",
//                           comment: "Comment 2"}
//                         ]
//              }
