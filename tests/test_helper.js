const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'Culoo',
    author: 'Matt Meneguzzi',
    url: 'www.culo.it',
    likes: 3,
  },
  {
    title: 'Merda',
    author: 'Matt Meneguzzi',
    url: 'www.merda.it',
    likes: 3,
  },
];

const initialUsers = [
  {
    username: 'ciccio',
    name: 'Franco M',
  },
  {
    username: 'ciccio2',
    name: 'Mauro S',
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' });
  await blog.save();
  await blog.remove();

  // eslint-disable-next-line no-underscore-dangle
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  initialUsers,
};
