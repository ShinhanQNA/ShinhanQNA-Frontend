"use client";

import { useState } from "react";
import Tab from "@/components/Tab";
import PostBox from "@/components/PostBox";
import PostList from "@/types/postlist";
import ThreeWeekGroup from "@/types/threeweekgroup";
import AnswerList from "@/types/answerlist";

function GeneralPosts({ posts }: { posts: PostList[] }) {
  return (
    <>
      {posts.map((post) => (
        <PostBox
          type="post"
          key={post.postId}
          slug={post.postId}
          title={post.title}
          content={post.content}
          likes={post.likes}
        />
      ))}
    </>
  );
}

function SelectedGroup({ group }: { group: ThreeWeekGroup[] }) {
  const year = new Date().getFullYear();

  return (
    <>
      {group.map((item) => (
        <PostBox
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

function AnswerPosts({ answers }: { answers: AnswerList[] }) {
  return (
    <>
      {answers.map((answer) => (
        <PostBox
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
  posts,
  group,
  answers
}: {
  posts: PostList[];
  group: ThreeWeekGroup[];
  answers: AnswerList[];
}) {
  const tabs = ["📣 말해봐요", "⭐️ 선정된 의견", "✅ 답변 왔어요"];
  const [tab, setTab] = useState<string>(tabs[0]);

  return (
    <>
      <Tab tabs={tabs} focusedTab={tab} onTabClick={(t) => t !== tab && setTab(t)} />
      {tab === tabs[0] && <GeneralPosts posts={posts} />}
      {tab === tabs[1] && <SelectedGroup group={group} />}
      {tab === tabs[2] && <AnswerPosts answers={answers} />}
    </>
  );
}
