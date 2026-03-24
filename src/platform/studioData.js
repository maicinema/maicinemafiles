export const getStudioData = () => {

const data = localStorage.getItem("studioData");

if(data){
return JSON.parse(data);
}

return {

founder:{
name:"PrinceMaozi",
bio:"",
image:""
},

team:[],

articles:{

filmProduction:{
title:"Film Production",
text:"",
header:"",
gallery:[]
},

television:{
title:"Television Production",
text:"",
header:"",
gallery:[]
},

events:{
title:"Event Coverage",
text:"",
header:"",
gallery:[]
},

maicinema:{
title:"MaiCinema",
text:"",
header:"",
gallery:[]
}

},

customArticles:[]

};

};

export const saveStudioData = (data)=>{

localStorage.setItem("studioData",JSON.stringify(data));

};