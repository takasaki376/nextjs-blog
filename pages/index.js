import Head from "next/head";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import {
  apiUrl,
  blogDelete,
  blogGet,
  blogPost,
  blogPut,
  getSortedPostsData,
} from "../lib/blogApi";
import Link from "next/link";
import Date from "../components/date";
import { TrashIcon } from "../components/TrashIcon";
import { UpdateIcon } from "../components/UpdateIcon";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";
import { PlusIcon } from "../components/PlusIcon";
import {
  editLogout,
  fetchAsyncAuth,
  selectIsLoggedIn,
  selectLoginUser,
} from "../lib/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

export const getStaticProps = async () => {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

const initialState = {
  id: "0",
  title: "",
  content: "",
};

const Home = ({ allPostsData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const loginUser = useSelector(selectLoginUser);

  // ログイン済かチェックする
  useEffect(() => {
    const loginCheck = async () => {
      await dispatch(fetchAsyncAuth());
    };
    loginCheck();
  }, []);

  // ------------------------
  // 全件検索処理
  // SSGで取得した後に追加・更新・削除されているため差分を取得する。
  // SWRが差分データをマージしてくれる。
  const { data: blogs, mutate } = useSWR(apiUrl, blogGet, {
    initialData: allPostsData,
  });

  const filteredBlogs = blogs?.sort(function (a, b) {
    if (a.created_at < b.created_at) return 1;
    if (a.created_at > b.created_at) return -1;
    return 0;
  });

  const [updateBlog, setUpdateBlog] = useState(initialState);
  const [inputForm, setInputForm] = useState(false);

  // ------------------------
  // 更新処理
  const handleUpdate = async () => {
    if (updateBlog.id === "0") {
      // 登録
      await blogPost(apiUrl, updateBlog);
      await mutate();
    } else {
      // 更新
      await blogPut(apiUrl, updateBlog.id, updateBlog);
      await mutate();
    }
    setInputForm(false);
    setUpdateBlog(initialState);
  };

  // ------------------------
  // 削除処理
  const handleDeleteClick = async (id) => {
    await blogDelete(apiUrl, id);
    mutate();
  };

  // ------------------------
  // 更新画面に切り替え
  const handleUpdateForm = (id, title, content) => {
    setInputForm(true);
    setUpdateBlog({
      id: id,
      title: title,
      content: content,
    });
  };

  // ログイン画面へ遷移する or ログオフ
  const handleLogin = () => {
    if (isLoggedIn) {
      dispatch(editLogout());
    } else {
      router.push("/login");
    }
  };
  return (
    <Layout home name={loginUser.username}>
      <Head>…</Head>
      {inputForm ? (
        <div>
          <h2 className={utilStyles.headingLg}>
            {updateBlog.id === "0" ? "Blog Registration" : "Blog Update"}
          </h2>
          <TextField
            title="title"
            value={updateBlog.title}
            onChange={(e) => {
              setUpdateBlog({ ...updateBlog, title: e.currentTarget.value });
            }}
          />

          <TextField
            title="content"
            multiline
            rows={10}
            value={updateBlog.content}
            onChange={(e) => {
              setUpdateBlog({ ...updateBlog, content: e.currentTarget.value });
            }}
          />
          <div className={utilStyles.buttonGroup}>
            <Button
              variant="outline"
              onClick={() => {
                setInputForm(false);
                setUpdateBlog(initialState);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleUpdate();
              }}
            >
              {updateBlog.id === "0" ? "Register" : "Update"}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className={utilStyles.loginFrame}>
            <Button onClick={handleLogin}>
              {isLoggedIn ? "ログオフ" : "ログイン"}
            </Button>
          </div>
          <section className={utilStyles.headingMd}>…</section>
          <section
            className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}
          >
            <div className={utilStyles.listRow}>
              <h2 className={utilStyles.headingLg}>Blog</h2>
              {isLoggedIn ? (
                <PlusIcon
                  onClick={() => {
                    setInputForm(true);
                  }}
                />
              ) : null}
            </div>
            <ul className={utilStyles.list}>
              {filteredBlogs.map((blog) => (
                <li className={utilStyles.listItem} key={blog.id}>
                  {blog.username}
                  <br />
                  <div className={utilStyles.listRow}>
                    <Link href={`/posts/${blog.id}`}>
                      <a>{blog.title}</a>
                    </Link>
                    <div className={utilStyles.icon}>
                      {isLoggedIn && blog.owner === loginUser.id ? (
                        <>
                          <TrashIcon
                            onClick={() => {
                              handleDeleteClick(blog.id);
                            }}
                          />
                          <UpdateIcon
                            onClick={() => {
                              handleUpdateForm(
                                blog.id,
                                blog.title,
                                blog.content
                              );
                            }}
                          />
                        </>
                      ) : null}
                    </div>
                  </div>
                  <br />
                  <small className={utilStyles.lightText}>
                    <Date dateString={blog.created_at} />
                  </small>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Layout>
  );
};
export default Home;
