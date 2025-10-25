// auth-guard.js
(function(){
  const storageAuth = localStorage.getItem('larkon-auth') || sessionStorage.getItem('larkon-auth');
  const onLoginPage = /login\.html(?:$|\?)/i.test(location.pathname) || location.pathname.endsWith('/') && document.title.includes('Đăng nhập');

  if(!storageAuth){
    if(!onLoginPage){
      // chưa đăng nhập -> về trang login
      location.replace('login.html');
    }
    return;
  }

  // Đã đăng nhập
  try{
    const user = JSON.parse(storageAuth);
    // Hiển thị tên ở sidebar nếu có phần tử đích
    const nameEl = document.getElementById('userName');
    if(nameEl){ nameEl.textContent = user.name || user.email; }
  }catch(e){ /* ignore */ }

  // Gắn sự kiện Đăng xuất
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('[data-logout]');
    if(a){
      e.preventDefault();
      localStorage.removeItem('larkon-auth');
      sessionStorage.removeItem('larkon-auth');
      location.replace('login.html');
    }
  });
})();
