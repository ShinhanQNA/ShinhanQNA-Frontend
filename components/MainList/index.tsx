"use client";

import { useState } from "react";
import Tab from "@/components/Tab";
import PostBox from "@/components/PostBox";
import PostList from "@/types/postlist";
import ThreeWeekGroup from "@/types/threeweekgroup";
import AnswerList from "@/types/answerlist";

function GeneralPosts({
  isAdmin,
  posts
}: {
  isAdmin?: boolean;
  posts: PostList[];
}) {
  return (
    <>
      {posts.map((post) => (
        <PostBox
          isAdmin={isAdmin}
          type="post"
          key={post.postId}
          slug={post.postId}
          title={post.title}
          content={post.content}
          likes={post.likes}
          flags={post.reportCount}
          bans={post.warningStatus === "경고" ? 1 : post.warningStatus === "차단" ? 2 : 0}
        />
      ))}
    </>
  );
}

function SelectedGroup({
  isAdmin,
  group
}: {
  isAdmin?: boolean;
  group: ThreeWeekGroup[];
}) {
  const year = new Date().getFullYear();

  return (
    <>
      {group.map((item) => (
        <PostBox
          isAdmin={isAdmin}
          type="selected"
          key={item.groupId}
          slug={item.groupId}
          title={`${year}년 ${item.selectedMonth}월`}
          status={item.responseStatus}
        />
      ))}
    </>
  );
}

function AnswerPosts({
  isAdmin,
  answers
}: {
  isAdmin?: boolean;
  answers: AnswerList[];
}) {
  return (
    <>
      {answers.map((answer) => (
        <PostBox
          isAdmin={isAdmin}
          path="answer"
          type="notice"
          key={answer.id}
          slug={answer.id}
          title={answer.title}
          content={answer.content}
        />
      ))}
    </>
  );
}

export default function MainList({
  isAdmin,
  posts,
  group,
  answers
}: {
  isAdmin: boolean;
  posts: PostList[];
  group: ThreeWeekGroup[];
  answers: AnswerList[];
}) {
  const tabs = ["📣 말해봐요", "⭐️ 선정된 의견", "✅ 답변 왔어요"];
  const [tab, setTab] = useState<string>(tabs[0]);

  return (
    <>
      <Tab
        tabs={tabs}
        focusedTab={tab}
        onTabClick={(t) => t !== tab && setTab(t)}
      />
      {
        tab === tabs[0]
          &&
        <GeneralPosts
          isAdmin={isAdmin}
          posts={posts}
        />
      }
      {
        tab === tabs[1]
          && 
        <SelectedGroup
          isAdmin={isAdmin}
          group={group}
        />
      }
      {
        tab === tabs[2]
          &&
        <AnswerPosts
          isAdmin={isAdmin}
          answers={answers}
        />
      }
    </>
  );
}
