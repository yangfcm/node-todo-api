const request = require('supertest');
const User = require('../models/user');

const app = require('../app');
const {
	usersForTest,
	seed
} = require('./seed/seed');

beforeEach(seed);  

const testUser = {
	username: 'testuser',
	email: 'testuser@todo.com',
	password: 'test1234'
};

test('Signup a new user', async() => {
	const response = 
				await request(app)
					.post('/users')
					.send(testUser)
					.expect(200);
	const user = await User.findById(response.body._id);
	expect(user).not.toBeNull();
	expect(response.body).toMatchObject({
		username: testUser.username,
		email: testUser.email
	});
	expect(user.password).not.toBe(testUser.password);
});

test('Login existing user successfully', async() => {
	const response = await request(app)
		.post('/users/login')
		.send({
			email: usersForTest[0].email,
			password: usersForTest[0].password
		})
		.expect(200);
		const user = await User.findById(usersForTest[0]._id);
		expect(response.header['x-auth']).toBe(user.tokens[1].token);
});

test('NOT login nonexistent user', async() => {
	await request(app)
		.post('/users/login')
		.send({
			email: 'nonexist@todo.com',
			password: 'Nopass'
		})
		.expect(400);
});

test('Get profile for one user', async() => {
	await request(app)
		.get('/users/me')
		.set('x-auth', 'Bearer ' + usersForTest[0].tokens[0].token)
		.expect(200);
});

test('NOT get profile for unauthenticated user', async() => {
	await request(app)
		.get('/users/me')
		.send()
		.expect(401);
});

test('Delete account for user', async() => {
	const response = await request(app)
		.delete('/users/me')
		.set('x-auth', 'Bearer ' + usersForTest[0].tokens[0].token)
		.expect(200);
	const user = await User.findById(usersForTest[0]._id);
	expect(user).toBeNull();
});

test('NOT delete account for unauthenticated user', async() => {
	await request(app)
		.delete('/users/me')
		.set('x-auth', 'wrong token')
		.expect(401);
});

test('Upload avatar image', async() => {
	await request(app)
		.post('/users/me/avatar')
		.set('x-auth', 'Bearer ' + usersForTest[0].tokens[0].token)
		.attach('avatar', 'server/tests/fixtures/profile-pic.jpg')
		.expect(200);
	const user = await User.findById(usersForTest[0]._id);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Update valid user fields', async() => {
	const response = await request(app)
		.patch('/users/me')
		.set('x-auth', 'Bearer ' + usersForTest[1].tokens[0].token)
		.send({
			username: 'mike'
		})
		.expect(200);
		const user = await User.findById(usersForTest[1]._id);
		expect(user.username).toBe('mike');
});