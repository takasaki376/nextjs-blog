import Layout from "../../components/layout";
import {
  apiUrl,
  blogGetPk,
  getAllPostIds,
  getPostData,
} from "../../lib/blogApi";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import useSWR from "swr";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const getStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = await getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

const Post = ({ postData }) => {
  const router = useRouter();
  const { data: blog, mutate } = useSWR(`${apiUrl}${postData.id}/`, blogGetPk, {
    initialData: postData,
  });
  useEffect(() => {
    mutate();
  }, []);

  if (router.isFallback || !blog) {
    return <div>Loading...</div>;
  }
  return (
    <Layout name={blog.username}>
      <Head>
        <title>{blog.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{blog.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={blog.created_at} />
        </div>
        <div>{blog.content}</div>
      </article>
    </Layout>
  );
};
export default Post;
