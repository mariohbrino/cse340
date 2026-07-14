const showHomePage = async (request, response) => {
  const title = "Home";
  response.render("home", { title });
};

export { showHomePage };
