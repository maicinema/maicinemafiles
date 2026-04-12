export const PLATFORM = {

youtube: "https://www.youtube.com/@OfficialMaicinema",

facebook: "https://www.facebook.com/share/1Apo6bi89E/?mibextid=wwXIfr",

instagram: "https://www.instagram.com/official_maicinema",

email: "princemaoziglobalstudiosltd@gmail.com",

};

export const hasAccess = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!user) return false;

  return user.isSubscribed === true;
};