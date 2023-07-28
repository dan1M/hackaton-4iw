// monMiddleware.js

const monMiddleware = async (ctx, next) => {
  console.log("Middleware exécuté !");
  const user = JSON.parse(sessionStorage.getItem("user"));

  // Vérifier si user.id n'existe pas et renvoyer un indicateur de redirection
  const shouldRedirect = !user || !user.id;
  return shouldRedirect;
};

export default monMiddleware;
