export const redirectToLogin = () => {
  const redirectTo = encodeURIComponent(window.location.origin);
  window.location.assign(`http://localhost:9000/login?redirectTo=${redirectTo}`);
};
