import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// Returns a JS file that renders the widget on product pages
router.get('/script', async (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  const base = process.env.APP_BASE_URL || '';

  const js = `
(function(){
  // Basic styles
  var style = document.createElement('style');
  style.innerHTML = ".baqat-card{font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; border:1px solid #eee; padding:12px; margin:10px 0; border-radius:12px; box-shadow:0 1px 4px rgba(0,0,0,.06)} .baqat-btn{padding:8px 12px; border:none; border-radius:8px; background:#111; color:#fff; cursor:pointer} .baqat-row{display:flex; align-items:center; justify-content:space-between; gap:10px} .baqat-title{font-weight:700}";
  document.head.appendChild(style);

  var container = document.createElement('div');
  container.className = 'baqat-card';
  container.innerHTML = '<div class="baqat-row"><div class="baqat-title">لا تفوّت العروض الحلوة ✨</div><button id="baqatLoad" class="baqat-btn">اعرض العروض</button></div><div id="baqatContent" style="margin-top:10px"></div>';
  document.currentScript.parentNode.insertBefore(container, document.currentScript);

  var loadBtn = document.getElementById('baqatLoad');
  loadBtn.addEventListener('click', function(){
    var storeId = (window.__BAQAT__ && window.__BAQAT__.storeId) || 1;
    var productId = (window.__BAQAT__ && window.__BAQAT__.productId) || null;
    fetch('${base}/api/widget?storeId='+storeId+(productId?'&productId='+productId:''))
      .then(r=>r.json())
      .then(function(data){
        var box = document.getElementById('baqatContent');
        if(!data.offers || !data.offers.length){ box.innerHTML = 'لا توجد عروض حالياً'; return; }
        var html = data.offers.map(function(o){
          return '<div style="padding:8px 0;border-bottom:1px dashed #eee"><b>'+o.name+'</b><br/><small>'+o.type+'</small></div>';
        }).join('');
        box.innerHTML = html;
      });
    // ping analytics
    fetch('${base}/api/analytics?storeId=' + ((window.__BAQAT__ && window.__BAQAT__.storeId) || 1) + '&range=1d').catch(()=>{});
  });
})();`;

  res.send(js);
});

// GET /api/widget?storeId=1&productId=123
router.get('/', async (req, res) => {
  try {
    const storeId = parseInt(req.query.storeId || '1', 10);
    const offers = await prisma.offer.findMany({
      where: { storeId, active: true },
      orderBy: { id: 'asc' }
    });
    // record a visitor event
    await prisma.analyticsEvent.create({
      data: { storeId, type: 'widget_open', count: 1 }
    });

    res.json({ storeId, offers });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load widget' });
  }
});

export default router;
