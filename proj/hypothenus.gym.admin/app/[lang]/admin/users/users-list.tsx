"use client"

import { Page } from "@/src/lib/entities/page";
import UserListDetails from "./users-list-details";
import { User } from "@/src/lib/entities/user";

export default function UsersList({ lang, pageOfUsers }: { lang: string; pageOfUsers?: Page<User> }) {

  return (

    <div className="d-flex flex-row flex-wrap mt-2 mb-2">

      {pageOfUsers?.content.map((user: User) => {
        return <UserListDetails key={user.uuid} lang={lang} user={user} ></UserListDetails>
      })}

    </div>
  );
}
