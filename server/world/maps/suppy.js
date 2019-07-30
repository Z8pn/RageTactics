module.exports = {
   mode:"Team Elimination",
   name: "LS Supply",
   objects: [],
   spawns: [
       {team:0,x:1222.118 ,y:-1234.572 ,z:35.450,heading:356.321},
       {team:0,x:1220.118 ,y:-1234.572 ,z:35.450,heading:356.321},
       {team:0,x:1218.118 ,y:-1234.572 ,z:35.450,heading:356.321},
       {team:0,x:1216.118 ,y:-1234.572 ,z:35.450,heading:356.321},
       {team:0,x:1214.118 ,y:-1234.572 ,z:35.450,heading:356.321},
       {team:0,x:1224.118 ,y:-1234.572 ,z:35.450,heading:356.321},
       {team:0,x:1226.118 ,y:-1234.572 ,z:35.450,heading:356.321},
       {team:0,x:1228.118 ,y:-1234.572 ,z:35.450,heading:356.321},
       {team:1,x:1146.896 ,y:-1356.765 ,z:34.660,heading:181.167},
       {team:1,x:1148.896 ,y:-1356.765 ,z:34.660,heading:181.167},
       {team:1,x:1150.896 ,y:-1356.765 ,z:34.660,heading:181.167},
       {team:1,x:1152.896 ,y:-1356.765 ,z:34.660,heading:181.167},
       {team:1,x:1144.896 ,y:-1356.765 ,z:34.660,heading:181.167},
       {team:1,x:1142.896 ,y:-1356.765 ,z:34.660,heading:181.167},
       {team:1,x:1140.896 ,y:-1356.765 ,z:34.660,heading:181.167},
       {team:1,x:1138.896 ,y:-1356.765 ,z:34.660,heading:181.167}
   ],
   max_players: 16,
   image: "https://cdn.discordapp.com/attachments/597607496357642250/601864427028873217/Grand_Theft_Auto_V_Screenshot_2019.07.19_-_21.40.15.24.png",
   weapons:[
       {hash:mp.joaat("weapon_pistol_mk2"),ammo:100},
       {hash:mp.joaat("weapon_pumpshotgun_mk2"),ammo:10},
       {hash:mp.joaat("weapon_carbinerifle_mk2"),ammo:300}
   ],
   teams: [{
       name: "Team Marabunta Grande",
       clothing: [ 
           {gender:0,componentNumber:11, drawable:189, texture:4, palette:0},
           {gender:0,componentNumber:8, drawable:0, texture:0, palette:0},
           {gender:0,componentNumber:7, drawable:50, texture:0, palette:0},
           {gender:0,componentNumber:6, drawable:1, texture:5, palette:0},
           {gender:0,componentNumber:4, drawable:16, texture:8, palette:0},
           {gender:0,componentNumber:3, drawable:16, texture:0, palette:0},
           {gender:0,componentNumber:1, drawable:118, texture:19, palette:0}
       ],
       max:8
   }, {
       name: "Team Bratwa",
       clothing: [
           {gender:0,componentNumber:11, drawable:53, texture:1, palette:0},
           {gender:0,componentNumber:8, drawable:0, texture:16, palette:0},
           {gender:0,componentNumber:7, drawable:17, texture:0, palette:0},
           {gender:0,componentNumber:6, drawable:10, texture:0, palette:0},
           {gender:0,componentNumber:4, drawable:24, texture:1, palette:0},
           {gender:0,componentNumber:3, drawable:11, texture:0, palette:0},
           {gender:0,componentNumber:1, drawable:21, texture:1, palette:0}
       ],
       max:8
   }],
   previewCam:{
       x:1222.118 ,y:-1234.572 ,z:35.450,
     px:1222.118 ,py:-1234.572 ,pz:65.450
   }
}
