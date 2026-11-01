import {env} from 'cloudflare:workers';
import {requireChatGPTUser} from '../chatgpt-auth';
import Inbox from '../../src/inbox';
export const dynamic='force-dynamic';
export const metadata={title:'Firm Inbox',robots:{index:false,follow:false}};
export default async function Page(){const user=await requireChatGPTUser('/inbox');const allowed=String((env as any).INBOX_OWNER_EMAIL||'').toLowerCase().split(',').map(s=>s.trim());if(!allowed.includes(user.email.toLowerCase()))return <main className="access-page"><h1>Access restricted.</h1><p>This inbox is available to the firm owner.</p><a href="/">Return to the website</a></main>;return <Inbox/>}
