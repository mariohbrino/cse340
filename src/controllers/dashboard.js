const showDashboard = (request, response) => {
  const user = request.session.user;
  response.render("dashboard", {
    title: "Dashboard",
    name: user.name,
    email: user.email,
  });
};

export { showDashboard };
