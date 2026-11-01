import { env } from 'cloudflare:workers';
import { z } from 'zod';
export const dynamic = 'force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const schema=z.object({id:z.string().uuid(),firstName:z.string().trim().min(1).max(80),lastName:z.string().trim().min(1).max(80),email:z.string().trim().email().max(254),phone:z.string().trim().max(30).default(''),matter:z.enum(['Criminal Defense','Family Law','Civil Litigation','Personal Injury','Something else']),meeting:z.enum(['Phone','Video','In person']),message:z.string().trim().min(20).max(3000),consent:z.literal(true),website:z.string().max(0).optional()});
const allowed=()=>String((env as any).INBOX_OWNER_EMAIL||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
const isOwner=(request:Request)=>!!request.headers.get('oai-authenticated-user-id')&&allowed().includes((request.headers.get('oai-authenticated-user-email')||'').toLowerCase());
function sameOrigin(request:Request){const origin=request.headers.get('Origin');return origin===new URL(request.url).origin;}
export async function POST(request:Request){
 if(!sameOrigin(request))return json({error:'Please submit this form from our website.'},403);
 if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'Unsupported request format.'},415);
 if(Number(request.headers.get('Content-Length')||0)>16000)return json({error:'Your message is too long.'},413);
 try{
 const raw=await request.text();if(raw.length>16000)return json({error:'Your message is too long.'},413);
 let payload;try{payload=JSON.parse(raw)}catch{return json({error:'Invalid request format.'},400)}
 const parsed=schema.safeParse(payload);if(!parsed.success)return json({error:'Please check your name, email, practice area, and message (at least 20 characters).'},400);
 const d=parsed.data,db=env.DB;if(!db)return json({error:'Our request service is temporarily unavailable. Please try again later.'},503);
 const reference='BC-'+d.id.replaceAll('-','').slice(0,10).toUpperCase();
 const existing=await db.prepare('SELECT id FROM inquiries WHERE id = ?').bind(d.id).first();if(existing)return json({reference});
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+String((env as any).INQUIRY_HASH_SALT||'bennett-cole-intake')));const hash=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');const now=Date.now();
 const result=await db.prepare('INSERT OR IGNORE INTO inquiries (id,first_name,last_name,email,phone,matter,message,meeting,status,created_at,ip_hash) SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM inquiries WHERE ip_hash = ? AND created_at > ?) < 5').bind(d.id,d.firstName,d.lastName,d.email,d.phone,d.matter,d.message,d.meeting,'new',now,hash,hash,now-3600000).run();
 if(!result.meta.changes)return json({error:'There have been several requests from your connection. Please try again in an hour.'},429);
 return json({reference},201);
 }catch{return json({error:'We could not save your request. Please try again.'},500);}
}
export async function GET(request:Request){
 if(!isOwner(request))return json({error:'Access restricted to the firm owner.'},403);
 const url=new URL(request.url),offset=Math.max(0,Math.min(100000,Number(url.searchParams.get('offset'))||0));
 try{const result=await env.DB!.prepare('SELECT id,first_name AS firstName,last_name AS lastName,email,phone,matter,message,meeting,status,created_at AS createdAt FROM inquiries ORDER BY created_at DESC LIMIT 51 OFFSET ?').bind(offset).all();return json({items:result.results.slice(0,50),hasMore:result.results.length>50});}catch{return json({error:'Unable to load requests.'},500);}
}
export async function PATCH(request:Request){
 if(!sameOrigin(request)||!isOwner(request))return json({error:'Access restricted.'},403);
 try{const parsed=z.object({id:z.string().uuid(),status:z.enum(['new','contacted','closed'])}).safeParse(await request.json());if(!parsed.success)return json({error:'Invalid request.'},400);await env.DB!.prepare('UPDATE inquiries SET status = ? WHERE id = ?').bind(parsed.data.status,parsed.data.id).run();return json({ok:true});}catch{return json({error:'Unable to update request.'},500);}
}
