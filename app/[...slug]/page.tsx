import Site from '../../src/main';
import {knownPaths,pageTitle} from '../../src/site-data';
import {notFound} from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;return {title:pageTitle('/'+slug.join('/'))};}
export default async function Page({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;const path='/'+slug.join('/');if(!knownPaths.includes(path))notFound();return <Site path={path}/>}
