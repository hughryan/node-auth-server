const supertest = require('supertest');
const should = require('chai').should();
const expect = require('chai').expect;

const config = require('_/config');

const mongoose = require('mongoose');
const User = require('_/models/user');
mongoose.connect(config.database);

const api = supertest("https://localhost:8443");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var token = null;

// Reset testing data
before((done) => {
  User.remove({
    email: 'test@test.com'
  }, (err) => {
    if (err) return handleError(err);
  });
  done();
});

after((done) => {
  User.remove({
    email: 'test@test.com'
  }, (err) => {
    if (err) return handleError(err);
  });
  done();
});

describe('authentication', () => {
  // SIGNUP
  describe('signup', () => {
    // no email
    it('signup should fail on no email', (done) => {
      api.post('/signup')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          password: 'testpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Email address required.');
          done();
        });
    });
    // no password
    it('signup should fail on no password', (done) => {
      api.post('/signup')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: "test@test.com"
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Password required.');
          done();
        });
    });
    // invalid email
    it('signup should fail on invalid email', (done) => {
      api.post('/signup')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'invalidemail',
          password: 'testpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Invalid email address.');
          done();
        });
    });
    // invalid password
    it('signup should fail on invalid password', (done) => {
      api.post('/signup')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'test@test.com',
          password: 'bad'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Invalid password.');
          done();
        });
    });
    // account creation
    it('signup should succeed on valid email & password', (done) => {
      api.post('/signup')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'test@test.com',
          password: 'testpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(true);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('An account for test@test.com was successfully created.');
          done();
        });
    });
    // account already exists
    it('signup should fail on account already existing', (done) => {
      api.post('/signup')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'test@test.com',
          password: 'testpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('An account for test@test.com already exists.');
          done();
        });
    });
  });
  // LOGIN
  describe('login', () => {
    // no email
    it('login should fail on no email', (done) => {
      api.post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          password: 'testpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Email address required.');
          done();
        });
    });
    // no password
    it('login should fail on no password', (done) => {
      api.post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'test@test.com',
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Password required.');
          done();
        });
    });
    // invalid email
    it('login should fail on invalid email', (done) => {
      api.post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'invalidemail',
          password: 'testpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Invalid email address.');
          done();
        });
    });
    // invalid password
    it('login should fail on invalid password', (done) => {
      api.post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'test@test.com',
          password: 'bad'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Invalid password.');
          done();
        });
    });
    // wrong email
    it('login should fail on wrong email', (done) => {
      api.post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'wrong@email.com',
          password: 'testpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Invalid credentials.');
          done();
        });
    });
    // wrong password
    it('login should fail on wrong password', (done) => {
      api.post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Invalid credentials.');
          done();
        });
    });
    // account login
    it('login should succeed on correct credentials and receive a token', (done) => {
      api.post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          email: 'test@test.com',
          password: 'testpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(true);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Successfully logged in.');
          expect(res.body).to.have.property('token');
          token = res.body.token;
          done();
        });
    });
  });
  // TOKEN
  describe('token access', () => {
    // no token
    it('users should fail on no token', (done) => {
      api.post('/users')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(403)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('No token provided.');
          done();
        });
    });
    // invalid token
    it('users should fail on invalid token', (done) => {
      api.post('/users')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', 'badtoken')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('success');
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Failed to authenticate token.');
          done();
        });
    });
    // valid token
    it('users should succeed on valid token', (done) => {
      api.post('/users')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          should.exist(res.body);
          done();
        });
    });
  });
});
