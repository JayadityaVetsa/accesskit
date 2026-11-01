/* AccessKit's extractor is deliberately deterministic. Every result retains a source span. */
export const EXAMPLES = {
 fellowship: {title:'Community Builder Fellowship',text:`Community Builder Fellowship — example notice, not a real program
Applications close on November 7, 2026 at 5:00 PM EST.
Applicants must be currently enrolled undergraduate students and reside in the United States.
Submit a resume, a project portfolio, and a 300-word statement of interest.
At least one recommendation letter is required.
The fellowship is free to apply to; selected fellows receive a $1,000 stipend.
Finalists may be invited to a remote interview.
The FAQ says applications close November 9, 2026.
For accessibility accommodations, contact access@example.org.
Applications without a recommendation letter will not be reviewed.`},
 pantry: {title:'Neighborhood food pantry',text:`Neighborhood pantry — example notice, not a real service
Pickup is available every Tuesday from 2 PM to 5 PM.
Bring a photo ID and proof of address if available.
No one is turned away for missing documents.
Residents of the Northside neighborhood are eligible.
Call 555-0100 before your first visit to confirm pickup availability.
There is no fee. Walk-ins are welcome, but supplies are limited.
The entrance has three steps. For step-free access, call ahead.
Registration opens next Monday.`},
 grant: {title:'Campus project microgrant',text:`Campus project microgrant — example notice, not a real award
Apply by December 2, 2026 at 11:59 PM.
Teams must have at least two enrolled students.
Upload a proposal PDF and an itemized budget.
Do not upload identity documents or bank details.
Funding of up to $500 is available for approved projects.
Submit a faculty sponsor name if your project uses lab equipment.
Applications open November 1, 2026.
Contact grants@example.org for questions.`}
};
export function splitSource(text) {
 const spans=[];
 // Lines preserve URLs/email addresses and avoid splitting decimal amounts.
 let offset=0;
 for(const line of text.split(/\n/)){const trimmed=line.trim();if(trimmed)spans.push({id:'s'+spans.length,text:trimmed,start:offset+line.indexOf(trimmed),end:offset+line.indexOf(trimmed)+trimmed.length});offset+=line.length+1;}
 return spans;
}
const months='January February March April May June July August September October November December'.split(' ');
const monthPattern=months.map(m=>m+'|'+m.slice(0,3)).join('|');
export function datesIn(text){
 const dates=[];const rx=new RegExp('\\b('+monthPattern+')\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(20\\d{2}))?\\b','gi');let m;
 while((m=rx.exec(text))){const month=months.findIndex(x=>x.toLowerCase().startsWith(m[1].toLowerCase()));const day=Number(m[2]);const year=m[3]?Number(m[3]):null;const valid=day>=1&&day<=new Date(Date.UTC(year||2024,month+1,0)).getUTCDate();dates.push({label:m[0],iso:valid&&year?`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`:null,needsReview:!year||!valid});}
 return dates;
}
export function analyze(text){
 const source=splitSource(text);const items=[];const questions=[];const deadlines=[];
 for(const s of source){const t=s.text;const groups=[];
 if(/\b(eligible|eligibility|applicants? must|teams? must|reside|residents?|enrolled|ages? \d|years? old)\b/i.test(t))groups.push('Eligibility');
 if(/\b(submit|upload|bring|provide|required|requirement|resume|recommendation|proof of|proposal|portfolio|statement of)\b/i.test(t))groups.push('Documents & actions');
 if(/\b(call|contact|email|register|apply|sign up)\b/i.test(t)&&!groups.includes('Documents & actions'))groups.push('Next steps');
 if(/\b(fee|cost|free|stipend|funding|\$\d)\b/i.test(t))groups.push('Costs & support');
 if(/\b(accessibility|accommodation|step.free|wheelchair|entrance|missing documents|turned away)\b/i.test(t))groups.push('Access details');
 const ds=datesIn(t);const deadline=/\b(deadline|close[sd]?|due|apply by|submit by|no later than)\b/i.test(t);
 for(const d of ds){const entry={...d,sourceId:s.id,text:t,kind:deadline?'Deadline':'Date mentioned'};deadlines.push(entry);}
 if(deadline&&!ds.length)questions.push({text:'The notice mentions a deadline without a full calendar date. Confirm the exact date.',sourceIds:[s.id]});
 if(/\b(tomorrow|next (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week)|every (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week))\b/i.test(t))questions.push({text:'A relative or recurring date needs confirmation against the original notice date.',sourceIds:[s.id]});
 for(const group of groups){items.push({id:`${s.id}-${group}`,group,text:t,sourceId:s.id,conditional:/\b(if|may|if available|but|unless|only)\b/i.test(t),negative:/\b(do not|must not|no one|not be|without|never)\b/i.test(t)});}
 }
 const distinct=[...new Set(deadlines.filter(d=>d.kind==='Deadline'&&d.iso).map(d=>d.iso))];
 if(distinct.length>1)questions.unshift({text:'Different deadline dates appear. They may refer to separate stages or conflict. Confirm which deadline applies before relying on either.',sourceIds:deadlines.filter(d=>d.kind==='Deadline').map(d=>d.sourceId)});
 if(deadlines.some(d=>d.needsReview))questions.push({text:'A date has no year or is invalid. AccessKit will not guess a calendar date.',sourceIds:deadlines.filter(d=>d.needsReview).map(d=>d.sourceId)});
 if(deadlines.some(d=>!(/\b(UTC|GMT|EST|EDT|CST|CDT|PST|PDT|[A-Za-z]+\/[A-Za-z_]+)\b/.test(d.text))))questions.push({text:'A date has no explicit time zone. Confirm the organizer’s local time and closing time.',sourceIds:deadlines.filter(d=>!(/\b(UTC|GMT|EST|EDT|CST|CDT|PST|PDT|[A-Za-z]+\/[A-Za-z_]+)\b/.test(d.text))).map(d=>d.sourceId)});
 if(!items.some(i=>i.group==='Eligibility'))questions.push({text:'No eligibility statement was detected. Check the full notice or ask the organizer.',sourceIds:[]});
 if(!deadlines.some(d=>d.kind==='Deadline'))questions.push({text:'No application deadline was detected. This does not mean there is no deadline.',sourceIds:[]});
 return {source,items,deadlines,questions};
}
export function markdownPacket(title,result,completed=new Set()){
 return `# ${title||'My action plan'}\n\nCreated with AccessKit. Rule-based extraction; verify the complete notice.\n\n## Checklist\n\n`+result.items.map(i=>`- [${completed.has(i.id)?'x':' '}] **${i.group}**: ${i.text} [${i.sourceId}]`).join('\n')+'\n\n## Dates to verify\n\n'+result.deadlines.map(d=>`- ${d.label} — ${d.kind}; ${d.needsReview?'needs review':d.iso} [${d.sourceId}]`).join('\n')+'\n\n## Questions for the organizer\n\n'+result.questions.map(q=>'- '+q.text).join('\n')+'\n\n## Original source\n\n'+result.source.map(s=>`[${s.id}] ${s.text}`).join('\n\n');
}
export function calendarFile(date,title){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error('A confirmed ISO date is required');
 const escape=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
 const start=date.replaceAll('-','');const end=new Date(date+'T00:00:00Z');end.setUTCDate(end.getUTCDate()+1);const next=end.toISOString().slice(0,10).replaceAll('-','');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AccessKit//Action Plan//EN','BEGIN:VEVENT',`UID:${start}-${Date.now()}@accesskit.local`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+Z/,'Z')}`,`DTSTART;VALUE=DATE:${start}`,`DTEND;VALUE=DATE:${next}`,`SUMMARY:${escape(title)}`,'DESCRIPTION:Date reminder only. Verify the original notice for exact closing time and timezone.','END:VEVENT','END:VCALENDAR',''].join('\r\n');
}
