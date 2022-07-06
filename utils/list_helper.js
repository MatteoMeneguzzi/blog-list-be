// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  let total = 0;
  blogs.forEach((element) => {
    total += element.likes;
  });
  return total;
};

const favoriteBlog = (blogs) => {
  const values = blogs.map((element) => element.likes);

  let max = values[0];

  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < values.length; index++) {
    const element = values[index];
    if (element > max) max = element;
  }

  const favorites = blogs.filter((blog) => blog.likes === max);

  const returnedFavorites = favorites.map((blog) => ({
    title: blog.title,
    author: blog.author,
    likes: blog.likes,
  }));

  return returnedFavorites[0];
};

const mostBlogs = (blogs) => {
  const values = blogs.map((element) => element.author);

  const counts = {};
  let compare = 0;
  let mostFrequent;

  // eslint-disable-next-line no-plusplus
  for (let i = 0, len = values.length; i < len; i++) {
    const author = values[i];

    if (counts[author] === undefined) {
      counts[author] = 1;
    } else {
      counts[author] += 1;
    }
    if (counts[author] > compare) {
      compare = counts[author];
      mostFrequent = values[i];
    }
  }

  const mostBlogsAuthor = {};

  mostBlogsAuthor.author = mostFrequent;
  mostBlogsAuthor.blogs = compare;

  console.log(mostBlogsAuthor);

  return mostBlogsAuthor.author === undefined ? undefined : mostBlogsAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
