const app = require('../server')
const request = require('request')

describe("Server", function(){
  beforeAll(function(done){
    this.port = 9876
    this.server = app.listen(this.port, (error, result) => {
      if (error) { return done(error) }
      done()
    })
  })

  afterAll(function(){
    this.server.close()
  })

  it("should exist", function(){
    expect(app).toBeDefined()
  })

  describe('GET /', function(){

    it("should return status 200", function(done){
      request.get("http://localhost:9876/", function(error, response){
        if (error) {done(error)}
        expect(response.statusCode).toBe(200)
        done()
      })
    })
  })

  describe('POST /newpoll', function(){
    beforeEach(function(){
      app.locals.polls = {}
      app.locals.admins = {}
    })

    it("should redirect to the admin page", function(done){
      var validPoll = {question: "Question about people",
                       responses: {a: "Alon",
                                   b: "Bret",
                                   c: "Chase",
                                   d: ""}
                      }
      request.post("http://localhost:9876/newpoll", {form: validPoll}, function(error, response){
        if (error) {done(error)}
        var adminKey = Object.keys(app.locals.admins)[0]

        expect(response.headers.location).toBe('/admin/' + adminKey)
        done()
      })
    })

    it('should receive and store a poll', function(done) {
      var validPoll = {question: "Question about people",
                       responses: {a: "Alon",
                                   b: "Bret",
                                   c: "Chase",
                                   d: ""}
                      }

      request.post("http://localhost:9876/newpoll", {form: validPoll}, function(error, response) {
        if (error) {done(error)}
        var finalPollCount = Object.keys(app.locals.polls).length

        expect(finalPollCount).toBe(1)
        done()
      })
    })

    it('should create an admin that links to the stored poll', function(done){
      var validPoll = {question: "Question about people",
                       responses: {a: "Alon",
                                   b: "Bret",
                                   c: "Chase",
                                   d: ""}
                      }

      request.post("http://localhost:9876/newpoll", {form: validPoll}, function(error, response) {
        if (error) {done(error)}

        var finalAdminCount = Object.keys(app.locals.admins).length
        expect(finalAdminCount).toBe(1)

        var adminKey = Object.keys(app.locals.admins)[0]
        var pollID = app.locals.admins[adminKey]
        expect(app.locals.polls[pollID].question).toBe("Question about people")
        done()
      })
    })
  })

})
