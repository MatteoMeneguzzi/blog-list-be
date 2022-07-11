const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  console.log('cleared');

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  console.log('entered test');

  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

test('there are three blogs', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('the first blog is about culi', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map((r) => r.title);
  expect(titles).toContain('Culoo');
});

test('blog without title is not added', async () => {
  const newBlog = {
    title: true,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb();

  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

  expect(resultBlog.body).toEqual(processedBlogToView);
});

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((r) => r.title);

  expect(titles).not.toContain(blogToDelete.title);
});

test('id is the only identifier property in blogs objects', async () => {
  const response = await api.get('/api/blogs');

  const ids = response.body.map((r) => r.id === response.body[0].id);

  expect(ids).toBeDefined();

  const valids = ids.filter((item) => item === true);

  expect(valids).toHaveLength(1);
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Merda',
    author: 'Matt Meneguzzi',
    url: 'www.merda.it',
    likes: 3,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((n) => n.title);
  expect(titles).toContain('Culoo');
});

test('a new blog with no likes property defined gets 0 likes by default', async () => {
  const newBlog = {
    title: 'Sugna',
    author: 'Matt Meneguzzi',
    url: 'www.sugna.it',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const likes = blogsAtEnd.map((n) => n.likes);

  expect(likes).toContain(0);
});

test('blog without title and url is not added', async () => {
  const newBlog = {
    likes: 8,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('a blog can be updated with valid properties', async () => {
  const newBlog = {
    likes: 8,
    author: 'Luuuuuuuuu',
  };

  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[1];

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  const likes = blogsAtEnd.map((n) => n.likes);
  expect(likes).toContain(8);
});

afterAll(() => {
  mongoose.connection.close();
});
