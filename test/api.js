//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Подключаем dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);



function registration(testUser){
    return new Promise((resolve, reject) => {
        describe('/POST registration', () => {
            
            it('it should not POST registration without login, password and name', (done) => {
        
                chai.request(server)
                    .post('/api/register')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("error");
                        res.body.should.have.property('msg');
                        done();
                    });
            });

            it('it should POST registration with login, password and name', (done) => {
        
              chai.request(server)
                  .post('/api/register')
                  .send(testUser)
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('token');
                      done();
                  });
            });
            
            it('it should not POST registration with already reistered login', (done) => {
        
                chai.request(server)
                    .post('/api/register')
                    .send(testUser)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("error");
                        res.body.should.have.property('msg');
                        done();
                        resolve(true);
                    });
              });
        });
    });
}

function login(login, password){
    return new Promise((resolve, rej) => {
        describe('/POST login', () => {
            it('it should POST login with login, password', (done) => {
        
              chai.request(server)
                  .post('/api/login')
                  .send({login, password})
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('token');
                      res.body.should.have.property('login').eql(login);
                      res.body.should.have.property('name');
                      res.body.should.have.property('id');
                      done();
                      resolve(res.body.token);
                  });
            });
        
        });
    });
}

function createNote(token, note){
    return new Promise((resolve, rej) => {
        describe('/POST note', () => {
            it('it should not POST note with empty text', (done) => {
        
                chai.request(server)
                    .post('/api/note')
                    .set('Authorization', 'Bearer ' + token)
                    .send({text : ""})
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("error");
                        res.body.should.have.property('msg');
                        done();
                    });
            });
            
            it('it should not POST note without text', (done) => {
        
                chai.request(server)
                    .post('/api/note')
                    .set('Authorization', 'Bearer ' + token)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("error");
                        res.body.should.have.property('msg');
                        done();
                    });
            });

            it('it should not POST note with text lengt > 1000', (done) => {
        
                chai.request(server)
                    .post('/api/note')
                    .set('Authorization', 'Bearer ' + token)
                    .send({text : new Array(1010).join("J")})
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("error");
                        res.body.should.have.property('msg');
                        done();
                    });
            });

            it('it should POST note with text', (done) => {
        
              chai.request(server)
                  .post('/api/note')
                  .set('Authorization', 'Bearer ' + token)
                  .send(note)
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('status').eql("success");
                      res.body.should.have.property('data');
                      done();
                      resolve(res.body.data);
                  });
            });
        
        });
    });
}

function getNote(token1, id1, text1, token2){
    return new Promise((resolve, rej) => {
        describe('/GET note', () => {

            it('it should not GET the note without authorization', (done) => {
                chai.request(server)
                    .get('/api/note/'+id1)
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });

            it('it should not GET the note of another user', (done) => {
                chai.request(server)
                    .get('/api/note/'+id1)
                    .set('Authorization', 'Bearer ' + token2)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("error");
                        res.body.should.have.property('msg');
                        done();
                    });
            });

            it('it should GET the note', (done) => {
            chai.request(server)
                .get('/api/note/'+id1)
                .set('Authorization', 'Bearer ' + token1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql("success");
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('id').eql(id1);
                    res.body.data.should.have.property('text').eql(text1);
                    res.body.data.should.have.property('createdAt');
                    res.body.data.should.have.property('updatedAt');
                    res.body.data.should.have.property('linkAccess');
                    res.body.data.should.have.property('path');
                    res.body.data.should.have.property('userId');
                    done();
                    resolve(res.body.data)
                });
            });
        });
    });
}

function updateNote(token, noteId, text, token2){
    return new Promise((resolve, rej) => {
        describe('/PUT note', () => {

            it('it should not PUT the note without authorization', (done) => {
                chai.request(server)
                    .put('/api/note/'+noteId)
                    .send({text : text})
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });

            it('it should not PUT the note of another user', (done) => {
                chai.request(server)
                    .put('/api/note/'+noteId)
                    .send({text : text})
                    .set('Authorization', 'Bearer ' + token2)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("error");
                        res.body.should.have.property('msg');
                        done();
                    });
            });

            it('it should not PUT note with empty text', (done) => {
        
                chai.request(server)
                    .put('/api/note/' + noteId)
                    .set('Authorization', 'Bearer ' + token)
                    .send({text : ""})
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("error");
                        res.body.should.have.property('msg');
                        done();
                    });
            });
            
            it('it should not PUT note without text', (done) => {
        
                chai.request(server)
                    .put('/api/note/' + noteId)
                    .set('Authorization', 'Bearer ' + token)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("error");
                        res.body.should.have.property('msg');
                        done();
                    });
            });

            it('it should not PUT note with text lengt > 1000', (done) => {
        
                chai.request(server)
                    .put('/api/note/' + noteId)
                    .set('Authorization', 'Bearer ' + token)
                    .send({text : new Array(1010).join("J")})
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("error");
                        res.body.should.have.property('msg');
                        done();
                    });
            });

            it('it should PUT note with text', (done) => {
        
              chai.request(server)
                  .put('/api/note/' + noteId)
                  .set('Authorization', 'Bearer ' + token)
                  .send({text : text})
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('status').eql("success");
                      res.body.should.have.property('data');
                      res.body.data.should.have.property('id').eql(noteId);
                      res.body.data.should.have.property('text').eql(text);
                      res.body.data.should.have.property('createdAt');
                      res.body.data.should.have.property('updatedAt');
                      res.body.data.should.have.property('linkAccess');
                      res.body.data.should.have.property('path');
                      res.body.data.should.have.property('userId');
                      done();
                      resolve(res.body.data);
                  });
            });
        
        });
    });
}

function getNotes(token){
        describe('/GET notes', () => {

            it('it should GET user notes', (done) => {
            chai.request(server)
                .get('/api/notes')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql("success");
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data.should.have.property('length').eql(1);
                    res.body.data[0].should.have.property('id');
                    res.body.data[0].should.have.property('text');
                    res.body.data[0].should.have.property('createdAt');
                    res.body.data[0].should.have.property('updatedAt');
                    res.body.data[0].should.have.property('linkAccess');
                    res.body.data[0].should.have.property('path');
                    res.body.data[0].should.have.property('userId');
                    done();
                });
            });
        });

        describe('/GET notesCount', () => {

            it('it should GET user notes count', (done) => {
            chai.request(server)
                .get('/api/notesCount')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    console.log("res", res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql("success");
                    res.body.should.have.property('data').eql(1);
                    done();
                });
            });
        });
}

function noteLinkSharing(token, noteId, token2){
    return new Promise((resolve, rej) => {
        describe('/PUT noteLinkSharing', () => {

            it('it should not PUT the note linkSharing without authorization', (done) => {
                chai.request(server)
                    .put('/api/noteLinkSharing/' + noteId)
                    .send({state : true})
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });

            it('it should not PUT the note linkSharing of another user', (done) => {
                chai.request(server)
                    .put('/api/noteLinkSharing/' + noteId)
                    .send({state : true})
                    .set('Authorization', 'Bearer ' + token2)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("error");
                        res.body.should.have.property('msg');
                        done();
                    });
            });

            it('it should PUT note linkSharing', (done) => {
        
              chai.request(server)
                  .put('/api/noteLinkSharing/' + noteId)
                  .set('Authorization', 'Bearer ' + token)
                  .send({state : true})
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('status').eql("success");
                      res.body.should.have.property('data');
                      res.body.data.should.have.property('id').eql(noteId);
                      res.body.data.should.have.property('text');
                      res.body.data.should.have.property('createdAt');
                      res.body.data.should.have.property('updatedAt');
                      res.body.data.should.have.property('linkAccess').eql(true);
                      res.body.data.should.have.property('path');
                      res.body.data.should.have.property('userId');
                      done();
                      resolve(res.body.data);
                  });
            });
        
        });
    });
}

function readNote(note1Path, text){
        describe('/PUT noteLinkSharing', () => {

            it('it should GET the note with active linkSharing', (done) => {
                chai.request(server)
                    .get('/api/noteText/' + note1Path)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql("success");
                        res.body.should.have.property('data').eql(text);
                        done();
                    });
            });
        });
    
}

async function test(){
    let firstUser = {
        login: "test"+Date.now(),
        password: "123321",
        name: "TEST"
    };
    let secondUser = {
        login: "test2"+Date.now(),
        password: "123321",
        name: "TEST2"
    };

    let note = {text: "TEST NOTE TEXT"};

    await registration(firstUser);
    let token1 = await login(firstUser.login, firstUser.password);
    await registration(secondUser);
    let token2 = await login(secondUser.login, secondUser.password);
    let noteId = await createNote(token1, note);
    getNotes(token1);
    let noteRes = await getNote(token1, noteId, note.text, token2);
    noteRes = await updateNote(token1, noteId, 'TEST UPDATE', token2);
    await noteLinkSharing(token1, noteId, token2);
    readNote(noteRes.path, noteRes.text );

}

test();