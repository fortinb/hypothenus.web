"use client"

import { Member } from "@/src/lib/entities/member";
import { Page } from "@/src/lib/entities/page";
import MemberListDetails from "./members-list-details";

export default function MembersList({ lang, pageOfMembers }: { lang: string; pageOfMembers?: Page<Member> }) {

  return (

    <div className="d-flex flex-row flex-wrap mt-2 mb-2">

      {pageOfMembers?.content.map((member: Member) => {
        return <MemberListDetails key={member.uuid} lang={lang} member={member}></MemberListDetails>
      })}
      
    </div>
  );
}