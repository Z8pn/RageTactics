module.exports = {
   mode:"Team Elimination",
   name: "Hafen",
   objects: [],
   items:[
		{item_id:0,amount:4},
		{item_id:1,amount:3}
   ],
   spawns: [
	   {team:0,x:1028.812 ,y:-3105.215 ,z:5.901,heading:178.384},
	   {team:0,x:1030.812 ,y:-3105.215 ,z:5.901,heading:178.384},
	   {team:0,x:1032.812 ,y:-3105.215 ,z:5.901,heading:178.384},
	   {team:0,x:1034.812 ,y:-3105.215 ,z:5.901,heading:178.384},
	   {team:0,x:1026.812 ,y:-3105.215 ,z:5.901,heading:178.384},
	   {team:0,x:1024.812 ,y:-3105.215 ,z:5.901,heading:178.384},
	   {team:0,x:1022.812 ,y:-3105.215 ,z:5.901,heading:178.384},
	   {team:0,x:1020.812 ,y:-3105.215 ,z:5.901,heading:178.384},
	   {team:1,x:1028.812 ,y:-3105.215 ,z:5.901,heading:1.865},
	   {team:1,x:1030.812 ,y:-3105.215 ,z:5.901,heading:1.865},
	   {team:1,x:1032.812 ,y:-3105.215 ,z:5.901,heading:1.865},
	   {team:1,x:1034.812 ,y:-3105.215 ,z:5.901,heading:1.865},
	   {team:1,x:1026.812 ,y:-3105.215 ,z:5.901,heading:1.865},
	   {team:1,x:1024.812 ,y:-3105.215 ,z:5.901,heading:1.865},
	   {team:1,x:1022.812 ,y:-3105.215 ,z:5.901,heading:1.865},
	   {team:1,x:1020.812 ,y:-3105.215 ,z:5.901,heading:1.865}
   ],
   max_players: 16,
   image: "https://i.imgur.com/hnuswk7.png",
   weapons:[
	   {hash:mp.joaat("weapon_pistol_mk2"),ammo:100},
	   {hash:mp.joaat("weapon_pumpshotgun_mk2"),ammo:10},
	   {hash:mp.joaat("weapon_carbinerifle_mk2"),ammo:300}
   ],
   teams: [{
	   name: "Los Santos Vagos",
	   clothing: [
		   {gender:0,componentNumber:11, drawable:240, texture:1, palette:0},
		   {gender:0,componentNumber:8, drawable:0, texture:16, palette:0},
		   {gender:0,componentNumber:6, drawable:6, texture:0, palette:0},
		   {gender:0,componentNumber:4, drawable:59, texture:9, palette:0},
		   {gender:0,componentNumber:3, drawable:14, texture:0, palette:0},
		   {gender:0,componentNumber:1, drawable:110, texture:19, palette:0}
	   ],
	   max:8
   }, {
	   name: "Triaden",
	   clothing: [
		   {gender:0,componentNumber:11, drawable:206, texture:0, palette:0},
		   {gender:0,componentNumber:8, drawable:0, texture:26, palette:0},
		   {gender:0,componentNumber:6, drawable:36, texture:3, palette:0},
		   {gender:0,componentNumber:4, drawable:24, texture:2, palette:0},
		   {gender:0,componentNumber:3, drawable:2, texture:0, palette:0},
		   {gender:0,componentNumber:1, drawable:106, texture:0, palette:0}
	   ],
	   max:8
   }],
   previewCam:{
	   px:1028.812 ,py:-3105.215 ,pz:5.901,
	   x:1028.812 ,y:-3105.215 ,z:55.901
   }
}
