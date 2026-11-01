import type { Metadata } from 'next';
import '../src/fonts.css';
import '../src/styles.css';
import '../src/pages.css';
export const metadata:Metadata={title:{default:'Bennett & Cole | Charleston Attorneys at Law',template:'%s | Bennett & Cole'},description:'Thoughtful counsel. Determined advocacy. Meet Bennett & Cole in Charleston and explore criminal defense, family law, civil litigation, and personal injury.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
