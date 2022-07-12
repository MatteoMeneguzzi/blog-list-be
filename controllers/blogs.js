/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', async (request, response) => {
  // eslint-disable-next-line object-curly-newline
  const { title, author, url, likes } = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  let user = await User.findById(decodedToken.id);

  const users = await User.find({});

  if (!user) {
    // eslint-disable-next-line prefer-destructuring
    user = users[0];
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  console.log(savedBlog);
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

// trycatch is here for 4.13 Blog list expansions, step1, usually handled by express-async-errors
blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);

  const blog = await Blog.findById(request.params.id);

  if (user._id.toString() === blog.user.toString()) {
    try {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  } else {
    return response.status(401).json({ error: 'operation unauthorized' });
  }
});

// trycatch is here for 4.14 Blog list expansions, step2, usually handled by express-async-errors
blogsRouter.put('/:id', async (request, response, next) => {
  const { body } = request;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedPost = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.status(204).json(updatedPost);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
