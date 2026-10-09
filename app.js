const photos=[...document.querySelectorAll('[data-full]')];const dialog=document.querySelector('#viewer');let position=0;let trigger=null;function displayPhoto(){const item=photos[position];const full=document.querySelector('#full-photo');full.src=item.dataset.full;full.alt=item.dataset.caption;document.querySelector('#photo-caption').textContent=item.dataset.caption;document.querySelector('#photo-count').textContent=`${position+1} / ${photos.length}`;document.querySelector('#previous-photo').disabled=photos.length<2;document.querySelector('#next-photo').disabled=photos.length<2;}photos.forEach((item,n)=>item.addEventListener('click',()=>{position=n;trigger=item;displayPhoto();dialog.showModal();document.body.style.overflow='hidden';}));function step(amount){position=(position+amount+photos.length)%photos.length;displayPhoto();}document.querySelector('#previous-photo')?.addEventListener('click',()=>step(-1));document.querySelector('#next-photo')?.addEventListener('click',()=>step(1));document.querySelector('#close-viewer')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('close',()=>{document.body.style.overflow='';trigger?.focus();});dialog?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}});document.querySelectorAll('.subnav a').forEach(a=>{if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page');});

const printDialog=document.querySelector('#print-dialog');
if(printDialog){
  const closePrint=document.querySelector('#close-print-dialog');
  const room=document.querySelector('#room-mockup');
  const scene=document.querySelector('#room-scene');
  const artwork=document.querySelector('#room-art');
  const order=document.querySelector('#dialog-order');
  const priceLabel=document.querySelector('#dialog-print-price');
  const english=document.documentElement.lang==='en';
  const prices={'11':1500,'16':2000,'22':2400};
  const sizeOptions=[...document.querySelectorAll('input[name="print-size"]')];
  const printButtons=[...document.querySelectorAll('.print-image')];
  let currentTitle='';
  let previousFocus=null;
  function updateOrder(){
    const size=sizeOptions.find(option=>option.checked)?.value||'16';
    const price=`$${new Intl.NumberFormat(english?'en-US':'es-MX').format(prices[size])} MXN`;
    priceLabel.textContent=price;
    const subject=english?`Print order — ${currentTitle} · ${size} inches`:`Pedido de print — ${currentTitle} · ${size} pulgadas`;
    const body=english?`Hello Iván, I would like to order “${currentTitle}” in the ${size}-inch size (longest side), listed at ${price}. Could you confirm availability, finish, and how to complete the order?`:`Hola Iván, quisiera pedir la fotografía “${currentTitle}” en ${size} pulgadas por el lado más largo, con precio de ${price}. ¿Me confirmas disponibilidad, acabado y cómo realizar el pedido?`;
    order.href=`mailto:ivillagranaart@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  function openPrint(button){
    const card=button.closest('.print-card');
    const image=button.querySelector('img');
    currentTitle=card.querySelector('h2').textContent.trim();
    previousFocus=button;
    document.querySelector('#dialog-print-number').textContent=`${button.dataset.print} / ${String(printButtons.length).padStart(2,'0')}`;
    document.querySelector('#dialog-print-title').textContent=currentTitle;
    artwork.src=image.src;
    artwork.alt=image.alt;
    const portrait=Number(image.getAttribute('height'))>Number(image.getAttribute('width'));
    room.classList.toggle('portrait-room',portrait);
    scene.src=portrait?'assets/mockups/room-portrait-empty.png':'assets/mockups/room-landscape-empty.png';
    scene.alt=english?(portrait?'Room with a vertical frame for the preview':'Room with a horizontal frame for the preview'):(portrait?'Interior con marco vertical para la vista previa':'Interior con marco horizontal para la vista previa');
    sizeOptions.forEach(option=>{option.checked=option.value==='16';});
    room.dataset.printSize='16';
    updateOrder();
    printDialog.showModal();
    closePrint.focus();
  }
  printButtons.forEach(button=>button.addEventListener('click',()=>openPrint(button)));
  sizeOptions.forEach(option=>option.addEventListener('change',()=>{room.dataset.printSize=option.value;updateOrder();}));
  closePrint.addEventListener('click',()=>printDialog.close());
  printDialog.addEventListener('click',event=>{if(event.target===printDialog)printDialog.close();});
  printDialog.addEventListener('close',()=>previousFocus?.focus());
}
