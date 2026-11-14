(function(){
  const root=document.documentElement;
  const menuButton=document.querySelector('[data-menu]');
  const nav=document.querySelector('[data-nav]');
  const searchModal=document.querySelector('[data-search-modal]');
  const searchInput=document.querySelector('[data-search-input]');
  const searchResults=document.querySelector('[data-search-results]');
  const searchOpen=[...document.querySelectorAll('[data-search-open]')];
  const searchClose=document.querySelector('[data-search-close]');
  const data=[
    {title:'Além do agressor: quem sustenta o silêncio diante da violência sexual?',type:'Ensaio · Sociedade / Direitos humanos / Gênero',path:'artigos/alem-do-agressor/index.html',keywords:'violência sexual conivência rede apoio agressores vítimas gênero cultura assédio importunação darvo'},
    {title:'Artigos e ensaios',type:'Índice de publicações',path:'artigos/index.html',keywords:'artigos ensaios publicações escrita sociedade comportamento tecnologia educação direitos humanos'},
    {title:'Pesquisas em desenvolvimento',type:'Projetos de pesquisa',path:'pesquisas/index.html',keywords:'pesquisa revisão integrativa silenciamento violência sexual'},
    {title:'Sobre Narielly Santos',type:'Autoria',path:'sobre/index.html',keywords:'autora estudante design tecnologia pensamento crítico'},
  ];
  const prefix=document.body.getAttribute('data-root')||'./';
  // Links Início são absolutos no domínio publicado; a abertura local dos HTMLs continua possível.
  const homeLinks=[...document.querySelectorAll('[data-home-link]')];
  homeLinks.forEach(link=>{
    if(location.protocol==='file:') link.href=prefix+'index.html';
    link.addEventListener('click',event=>{
      // Na própria home, Início sempre retorna ao topo em vez de manter o scroll nos artigos.
      if(prefix==='./'){
        event.preventDefault();
        setMenu(false);
        if(location.hash) history.replaceState(null,'',location.pathname+location.search);
        window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
      }
    });
  });
  const setMenu=(open)=>{document.body.classList.toggle('nav-open',open);if(menuButton)menuButton.setAttribute('aria-expanded',String(open));};
  menuButton?.addEventListener('click',()=>setMenu(!document.body.classList.contains('nav-open')));
  nav?.querySelectorAll('a').forEach(x=>x.addEventListener('click',()=>setMenu(false)));
  document.querySelectorAll('[data-dropdown-toggle]').forEach(b=>b.addEventListener('click',()=>{const holder=b.closest('.nav-dropdown');const isOpen=holder.classList.toggle('open');b.setAttribute('aria-expanded',String(isOpen));}));
  const openSearch=()=>{if(!searchModal)return;setMenu(false);searchModal.classList.add('open');searchModal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');searchInput.value='';renderSearch('');searchInput.focus();};
  const closeSearch=()=>{searchModal?.classList.remove('open');searchModal?.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');};
  const esc=(s)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function renderSearch(query){
    const q=query.trim().toLocaleLowerCase('pt-BR');const matches=data.filter(v=>(v.title+' '+v.keywords+' '+v.type).toLocaleLowerCase('pt-BR').includes(q));
    searchResults.innerHTML=matches.length?matches.map(v=>`<a class="search-result" href="${prefix}${v.path}"><strong>${esc(v.title)}</strong><small>${esc(v.type)}</small></a>`).join(''):'<p class="search-empty">Nenhum resultado encontrado. Experimente outro termo.</p>';
  }
  searchInput?.addEventListener('input',e=>renderSearch(e.target.value));
  searchOpen.forEach(b=>b.addEventListener('click',openSearch));
  searchClose?.addEventListener('click',closeSearch);
  searchModal?.addEventListener('click',e=>{if(e.target===searchModal)closeSearch();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSearch();setMenu(false);} if(e.key==='/'&& !['INPUT','TEXTAREA'].includes(document.activeElement.tagName) && !e.ctrlKey && !e.metaKey){e.preventDefault();openSearch();}});
  document.querySelectorAll('[data-share]').forEach(b=>b.addEventListener('click',async()=>{let url=window.location.href;try{await navigator.clipboard.writeText(url);const old=b.textContent;b.textContent='LINK COPIADO ✓';setTimeout(()=>b.textContent=old,2400);}catch(e){const temp=document.createElement('textarea');temp.value=url;document.body.append(temp);temp.select();try{document.execCommand('copy');b.textContent='LINK COPIADO ✓';}catch(e){b.textContent='COPIE O ENDEREÇO DO NAVEGADOR';}temp.remove();}}));
  const category=new URLSearchParams(location.search).get('tema');
  if(category && document.querySelector('[data-article-list]')){
    const name={'sociedade':'Sociedade','comportamento':'Comportamento','tecnologia':'Tecnologia','educacao':'Educação','direitos-humanos':'Direitos humanos'}[category];
    const title=document.querySelector('[data-category-title]');if(title && name) title.textContent='Publicações em '+name;
    const hasArticle=['sociedade','direitos-humanos'].includes(category);
    document.querySelector('[data-article-list]').hidden=!hasArticle;
    const empty=document.querySelector('[data-empty-state]');if(empty)empty.hidden=hasArticle;
  }
  document.querySelectorAll('[data-year]').forEach(x=>x.textContent=String(new Date().getFullYear()));
  document.querySelector('[data-compose]')?.addEventListener('submit',e=>{
    e.preventDefault();let form=e.currentTarget;
    const assunto=form.elements['assunto'].value.trim();const mensagem=form.elements['mensagem'].value.trim();
    const url='mailto:?subject='+encodeURIComponent(assunto||'Contato sobre o site Narielly Santos')+'&body='+encodeURIComponent(mensagem+'\n\nMensagem enviada pelo formulário do site.');
    document.querySelector('[data-compose-feedback]').textContent='Seu aplicativo de e-mail será aberto. Adicione o endereço da destinatária antes de enviar.';
    window.location.href=url;
  });
})();
