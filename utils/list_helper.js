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

  console.log(returnedFavorites[0]);

  return returnedFavorites[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
