const deleteLeague=async(id)=>{console.log(id)
try{const res=await axios({method:'Delete',url:`/geez/admin/view_leagues/${id}`,});}catch(err){showAlert('danger',err.response.data.message);}
location.reload();}
const deleteMatch=async(id)=>{try{const res=await axios({method:'Delete',url:`/geez/admin/view_matches/${id}`,});if(res.data.status==='Success'){location.assign('/geez/admin/matches');}}catch(err){showAlert('danger','err.response.data.message');location.assign('/geez/admin/matches');}
location.reload();}
const deleteSingleMatch=async(id,leagueName,title,date)=>{try{const res=await axios({method:'Delete',url:`/geez/admin/view_matches/${leagueName}?matchIndex=${id}`,});if(res.data.status=='Success'){showAlert('success','deleted successfuly');}}catch(err){console.log('in success')
location.reload();}
try{const res=await axios({method:'Post',url:'/geez/admin/results',data:{leagueName:leagueName,matchTitle:title,date:date}});if(res.data.status=='Success'){showAlert('success','deleted successfuly');}
location.reload();}catch(err){showAlert('danger',err.response);location.reload();console.log('in catch')}}
const deleteResults=async(leagueName)=>{try{const res=await axios({method:'Delete',url:`/geez/admin/results/${leagueName}`,});if(res.data.status=='Success'){showAlert('success','deleted successfuly');}
location.reload();}catch(err){console.log('in success')
location.reload();}}