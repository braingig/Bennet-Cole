'use client';
import React,{useRef} from 'react';
import {motion,useReducedMotion,useInView} from 'framer-motion';
const easeOut = [.22, 1, .36, 1];
export function Reveal({children, className='', delay=0}) {
 const reduce=useReducedMotion();
 const photo=/about-photo/.test(className);
 const side=/about-photo/.test(className)?-30:/form-box|location-map/.test(className)?30:0;
 return <motion.div className={className} initial={reduce?false:{opacity:0,y:photo?22:35,x:side,...(photo?{clipPath:'inset(0 0 12% 0)'}:{})}} whileInView={{opacity:1,y:0,x:0,...(photo?{clipPath:'inset(-25px -25px -25px -25px)'}:{})}} viewport={{once:true,amount:.12}} transition={{duration:photo?1.05:.75,delay,ease:easeOut}}>{children}</motion.div>
}
export function TeamImageReveal({children}) {
 const frameRef=useRef(null);
 const reduce=useReducedMotion();
 const entered=useInView(frameRef,{once:true,amount:.15});
 return <div ref={frameRef} className="team-reveal-frame"><motion.div className="team-image" initial={reduce?false:{y:'100%'}} animate={{y:reduce||entered?0:'100%'}} transition={{duration:reduce?0:1.2,ease:[.16,1,.3,1]}}>{children}</motion.div></div>;
}
