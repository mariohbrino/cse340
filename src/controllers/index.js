const showHomePage = async (request, response) => {
  const title = "Home";
  return response.render("home", { title });
};

export { showHomePage };
