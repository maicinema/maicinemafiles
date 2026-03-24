export const API_URL = "https://api.maicinema.com";

export async function getFilms(){

const res = await fetch(`${API_URL}/films`);
return res.json();

}