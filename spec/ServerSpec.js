const app = require('../server')
const request = require('request')

describe("Server", function(){
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
