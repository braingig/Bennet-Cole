import {knownPaths} from '../../src/site-data';
export function GET(){
 const origin='https://bennett-cole-law-charleston.braingigllc.chatgpt.site';
 const entries=knownPaths.filter(p=>p!=='/inbox').map(path=>`<url><loc>${origin}${path}</loc></url>`).join('');
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
