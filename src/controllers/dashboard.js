import { getAllVolunteerByUserId } from "../models/volunteer.js";

const showDashboard = async (request, response) => {
  const user = request.session.user;
  const volunteers = await getAllVolunteerByUserId(user.user_id);

  response.render("dashboard", {
    title: "Dashboard",
    name: user.name,
    email: user.email,
    volunteers,
  });
};

export { showDashboard };
